import React, { createContext, useContext, useCallback, useRef, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';
import type { ConnectionStatus, WebSocketMessage } from '../hooks/useWebSocket';
import { useRecommendations } from './RecommendationsContext';
import { getUserId } from '../utils/auth';

// ============================================
// TYPE DEFINITIONS
// ============================================

interface RealTimeContextType {
  isConnected: boolean;
  connectionStatus: ConnectionStatus;
  sendMessage: (message: unknown) => boolean;
  subscribeToChannel: (channel: string) => void;
  unsubscribeFromChannel: (channel: string) => void;
  lastMessage: WebSocketMessage | null;
  reconnectAttempts: number;
}

interface RealTimeProviderProps {
  children: ReactNode;
}

// ============================================
// CONTEXT
// ============================================

const RealTimeContext = createContext<RealTimeContextType | undefined>(undefined);

export const useRealTime = () => {
  const context = useContext(RealTimeContext);
  if (!context) {
    throw new Error('useRealTime must be used within a RealTimeProvider');
  }
  return context;
};

// ============================================
// PROVIDER COMPONENT
// ============================================

export const RealTimeProvider: React.FC<RealTimeProviderProps> = ({ children }) => {
  const { refreshRecommendations } = useRecommendations();
  const subscribedChannels = useRef<Set<string>>(new Set());

  // Get user ID from auth utilities
  const userId = getUserId() || 'anonymous';

  // Use Vite environment variables
  const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws';
  const normalizedWsUrl = wsUrl.replace(/\/+$/, '');
  const socketUrl = normalizedWsUrl.endsWith('/ws')
    ? normalizedWsUrl
    : `${normalizedWsUrl}/ws`;

  // Message handler
  const handleMessage = useCallback((message: WebSocketMessage) => {
    switch (message.type) {
      case 'recommendation_update':
        refreshRecommendations();
        break;
      case 'adaptation_trigger':
        // Could dispatch to a notification system
        break;
      case 'performance_alert':
        break;
      case 'learning_milestone':
        break;
      case 'course_update':
        break;
      case 'notification':
        break;
      case 'subscription_update':
        break;
      case 'pong':
        // Keep-alive response
        break;
      default:
        break;
    }
  }, [refreshRecommendations]);

  const {
    isConnected,
    connectionStatus,
    sendMessage,
    lastMessage,
    reconnectAttempts
  } = useWebSocket(
    socketUrl,
    {
      onMessage: handleMessage,
      onConnect: () => {
        // Re-subscribe to all channels on reconnection
        subscribedChannels.current.forEach(channel => {
          sendMessage({
            type: 'subscribe',
            channel,
            user_id: userId,
            timestamp: new Date().toISOString()
          });
        });
      },
      onDisconnect: () => {
        // Connection lost - will attempt reconnection automatically
      },
      onError: (error) => {
        console.error('WebSocket error:', error);
      },
      autoConnect: true,
      includeToken: false
    }
  );

  // Send user identification when connected
  useEffect(() => {
    if (isConnected && userId !== 'anonymous') {
      sendMessage({
        type: 'user_connect',
        user_id: userId,
        timestamp: new Date().toISOString()
      });
    }
  }, [isConnected, userId, sendMessage]);

  // Channel subscription management
  const subscribeToChannel = useCallback((channel: string) => {
    subscribedChannels.current.add(channel);
    if (isConnected) {
      sendMessage({
        type: 'subscribe',
        channel,
        user_id: userId,
        timestamp: new Date().toISOString()
      });
    }
  }, [isConnected, sendMessage, userId]);

  const unsubscribeFromChannel = useCallback((channel: string) => {
    subscribedChannels.current.delete(channel);
    if (isConnected) {
      sendMessage({
        type: 'unsubscribe',
        channel,
        user_id: userId,
        timestamp: new Date().toISOString()
      });
    }
  }, [isConnected, sendMessage, userId]);

  const value: RealTimeContextType = {
    isConnected,
    connectionStatus,
    sendMessage,
    subscribeToChannel,
    unsubscribeFromChannel,
    lastMessage,
    reconnectAttempts
  };

  return (
    <RealTimeContext.Provider value={value}>
      {children}
    </RealTimeContext.Provider>
  );
};
