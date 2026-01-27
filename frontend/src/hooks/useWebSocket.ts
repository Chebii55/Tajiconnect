/**
 * WebSocket Hook
 * Handles real-time communication with the backend
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { getAccessToken } from '../utils/auth';

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface WebSocketMessage {
  type: string;
  data: unknown;
  timestamp: string;
  userId?: string;
}

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error' | 'reconnecting';

export interface UseWebSocketOptions {
  onMessage?: (message: WebSocketMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Event) => void;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  autoConnect?: boolean;
  includeToken?: boolean;
}

interface UseWebSocketReturn {
  isConnected: boolean;
  connectionStatus: ConnectionStatus;
  lastMessage: WebSocketMessage | null;
  sendMessage: (message: unknown) => boolean;
  connect: () => void;
  disconnect: () => void;
  reconnectAttempts: number;
}

// ============================================
// DEFAULT CONFIG FROM ENV
// ============================================

const DEFAULT_WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws';
const DEFAULT_RECONNECT_INTERVAL = Number(import.meta.env.VITE_WS_RECONNECT_INTERVAL) || 3000;
const DEFAULT_MAX_RECONNECT = Number(import.meta.env.VITE_WS_MAX_RECONNECT_ATTEMPTS) || 5;
const WS_ENABLED = import.meta.env.VITE_ENABLE_WEBSOCKET !== 'false';

// ============================================
// HOOK IMPLEMENTATION
// ============================================

export const useWebSocket = (
  url: string = DEFAULT_WS_URL,
  options: UseWebSocketOptions = {}
): UseWebSocketReturn => {
  const {
    onMessage,
    onConnect,
    onDisconnect,
    onError,
    reconnectInterval = DEFAULT_RECONNECT_INTERVAL,
    maxReconnectAttempts = DEFAULT_MAX_RECONNECT,
    autoConnect = true,
    includeToken = true,
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [reconnectCount, setReconnectCount] = useState(0);

  const ws = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  const reconnectTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isManualDisconnect = useRef(false);

  // Build WebSocket URL with token if needed
  const getWebSocketUrl = useCallback((): string => {
    if (!includeToken) return url;

    const token = getAccessToken();
    if (!token) return url;

    const wsUrl = new URL(url);
    wsUrl.searchParams.set('token', token);
    return wsUrl.toString();
  }, [url, includeToken]);

  // Connect to WebSocket
  const connect = useCallback(() => {
    if (!WS_ENABLED) {
      return;
    }

    if (ws.current?.readyState === WebSocket.OPEN) {
      return;
    }

    isManualDisconnect.current = false;
    setConnectionStatus('connecting');

    try {
      const wsUrl = getWebSocketUrl();
      ws.current = new WebSocket(wsUrl);

      ws.current.onopen = () => {
        setIsConnected(true);
        setConnectionStatus('connected');
        reconnectAttempts.current = 0;
        setReconnectCount(0);
        onConnect?.();
      };

      ws.current.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          setLastMessage(message);
          onMessage?.(message);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      ws.current.onclose = (event) => {
        setIsConnected(false);
        setConnectionStatus('disconnected');
        onDisconnect?.();

        // Attempt reconnection if not manually disconnected
        if (!isManualDisconnect.current && reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current++;
          setReconnectCount(reconnectAttempts.current);
          setConnectionStatus('reconnecting');

          reconnectTimeout.current = setTimeout(() => {
            connect();
          }, reconnectInterval);
        }
      };

      ws.current.onerror = (error) => {
        setConnectionStatus('error');
        onError?.(error);
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      setConnectionStatus('error');
      console.error('WebSocket connection failed:', error);
    }
  }, [getWebSocketUrl, onConnect, onDisconnect, onError, onMessage, maxReconnectAttempts, reconnectInterval]);

  // Disconnect from WebSocket
  const disconnect = useCallback(() => {
    isManualDisconnect.current = true;

    if (reconnectTimeout.current) {
      clearTimeout(reconnectTimeout.current);
      reconnectTimeout.current = null;
    }

    if (ws.current) {
      ws.current.close();
      ws.current = null;
    }

    setIsConnected(false);
    setConnectionStatus('disconnected');
    reconnectAttempts.current = 0;
    setReconnectCount(0);
  }, []);

  // Send message through WebSocket
  const sendMessage = useCallback((message: unknown): boolean => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      try {
        const payload = typeof message === 'string' ? message : JSON.stringify(message);
        ws.current.send(payload);
        return true;
      } catch (error) {
        console.error('Failed to send WebSocket message:', error);
        return false;
      }
    }
    return false;
  }, []);

  // Auto-connect on mount
  useEffect(() => {
    if (autoConnect && WS_ENABLED) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect, connect, disconnect]);

  // Reconnect when token changes
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'access_token' && isConnected) {
        disconnect();
        connect();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [isConnected, connect, disconnect]);

  return {
    isConnected,
    connectionStatus,
    lastMessage,
    sendMessage,
    connect,
    disconnect,
    reconnectAttempts: reconnectCount,
  };
};

export default useWebSocket;
