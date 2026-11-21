// src/context/NotificationContext.tsx
'use client';

import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  isVisible: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  showNotification: (message: string, type?: NotificationType) => void;
  clearNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = useCallback((message: string, type: NotificationType = 'info') => {
    const id = Date.now().toString();
    const newNotification = { id, message, type, isVisible: true };

    setNotifications(prev => [...prev, newNotification]);

    // Automatic disappearance effect
    setTimeout(() => {
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === id ? { ...notif, isVisible: false } : notif
        )
      );

      // completely remove
      setTimeout(() => {
        setNotifications(prev => prev.filter(notif => notif.id !== id));
      }, 500); // wait for fade out animation to complete
    }, 3000);
  }, []);

  const clearNotification = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, isVisible: false } : notif
      )
    );

    setTimeout(() => {
      setNotifications(prev => prev.filter(notif => notif.id !== id));
    }, 500);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        showNotification,
        clearNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};