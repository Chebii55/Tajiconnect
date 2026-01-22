import React, { createContext, useContext, ReactNode } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';
import { useRecommendations } from './RecommendationsContext';

interface RealTimeContextType {
  isConnected: boolean;
  connectionStatus: string;
  sendMessage: (message: any) => boolean;
}

const RealTimeContext = createContext<RealTimeContextType | undefined>(undefined);

export const useRealTime = () => {
  const context = useContext(RealTimeContext);
  if (!context) {
    throw new Error('useRealTime must be used within a RealTimeProvider');
  }
  return context;
};

interface RealTimeProviderProps {
  children: ReactNode;
}

export const RealTimeProvider: React.FC<RealTimeProviderProps> = ({ children }) => {
  const { refreshRecommendations } = useRecommendations();
  
  const userId = localStorage.getItem('user_id') || 'temp_user';
  const wsUrl = process.env.REACT_APP_WS_URL || 'ws://localhost:8000/ws';

  const { isConnected, connectionStatus, sendMessage } = useWebSocket(
    `${wsUrl}/user/${userId}`,
    {
      onMessage: (message) => {
        switch (message.type) {
          case 'recommendation_update':
            refreshRecommendations();
            break;
          case 'adaptation_trigger':
            // Show adaptation notification
            console.log('Adaptation triggered:', message.data);
            break;
          case 'performance_alert':
            // Show performance alert
            console.log('Performance alert:', message.data);
            break;
          case 'learning_milestone':
            // Show milestone achievement
            console.log('Milestone achieved:', message.data);
            break;
          default:
            console.log('Unknown message type:', message.type);
        }
      },
      onConnect: () => {
        console.log('Real-time connection established');
        // Send user identification
        sendMessage({
          type: 'user_connect',
          user_id: userId,
          timestamp: new Date().toISOString()
        });
      },
      onDisconnect: () => {
        console.log('Real-time connection lost');
      }
    }
  );

  const value: RealTimeContextType = {
    isConnected,
    connectionStatus,
    sendMessage
  };

  return (
    <RealTimeContext.Provider value={value}>
      {children}
    </RealTimeContext.Provider>
  );
};
