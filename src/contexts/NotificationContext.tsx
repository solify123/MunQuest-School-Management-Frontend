import React, { createContext, useContext, useEffect, useState } from 'react';
import socketService from '../services/socketService';

interface NotificationContextType {
  isConnected: boolean;
  notifications: NotificationData[];
  clearNotifications: () => void;
}

interface NotificationData {
  id: string;
  message: string;
  eventName: string;
  eventDescription?: string;
  startDate?: string;
  endDate?: string;
  eventId?: string;
  status?: string;
  timestamp: string;
  read: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  useEffect(() => {
    // Connect to socket
    const socket = socketService.connect();
    
    // Update connection status
    setIsConnected(socket.connected);
    console.log('🔌 Initial socket connection status:', socket.connected);

    // Listen for connection events
    socket.on('connect', () => {
      setIsConnected(true);
      console.log('✅ Socket connected successfully');
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      console.log('❌ Socket disconnected');
    });

    // Listen for event creation notifications
    socket.on('event_created', (data: Omit<NotificationData, 'id' | 'read'>) => {
      console.log('🔔 Event created notification received:', data);
      const newNotification: NotificationData = {
        id: Date.now().toString(),
        ...data,
        read: false
      };

      // Add to notifications list
      setNotifications(prev => [newNotification, ...prev]);

      console.log('✅ Event created notification processed');
    });

    // Listen for event status update notifications
    socket.on('event_status_updated', (data: Omit<NotificationData, 'id' | 'read'>) => {
      console.log('🔔 Event status updated notification received:', data);
      const newNotification: NotificationData = {
        id: Date.now().toString(),
        ...data,
        read: false
      };

      // Add to notifications list
      setNotifications(prev => [newNotification, ...prev]);
      console.log('✅ Event status updated notification processed');
    });

    // Listen for event deletion notifications
    socket.on('event_deleted', (data: Omit<NotificationData, 'id' | 'read'>) => {
      console.log('🔔 Event deleted notification received:', data);
      const newNotification: NotificationData = {
        id: Date.now().toString(),
        ...data,
        read: false
      };

      // Add to notifications list
      setNotifications(prev => [newNotification, ...prev]);

      console.log('✅ Event deleted notification processed');
    });

    // Listen for event update notifications
    socket.on('event_updated', (data: Omit<NotificationData, 'id' | 'read'>) => {
      console.log('🔔 Event updated notification received:', data);
      const newNotification: NotificationData = {
        id: Date.now().toString(),
        ...data,
        read: false
      };

      // Add to notifications list
      setNotifications(prev => [newNotification, ...prev]);

      console.log('✅ Event updated notification processed');
    });

    // Cleanup on unmount
    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('event_created');
      socket.off('event_status_updated');
      socket.off('event_deleted');
      socket.off('event_updated');
    };
  }, []);

  const clearNotifications = () => {
    setNotifications([]);
  };

  const value: NotificationContextType = {
    isConnected,
    notifications,
    clearNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
