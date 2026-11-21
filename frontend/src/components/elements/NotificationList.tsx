// src/components/NotificationList.tsx
'use client';

import React from 'react';
import { useNotification, Notification } from '@/contexts/notification/NotificationContext';

export default function NotificationList() {
  const { notifications, clearNotification } = useNotification();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end space-y-2 pointer-events-none">
      {notifications.map((notification, index) => (
        <NotificationItem 
          key={`${notification.id}-${index}`}
          notification={notification} 
          onClear={clearNotification} 
        />
      ))}
    </div>
  );
}

interface NotificationItemProps {
  notification: Notification;
  onClear: (id: string) => void;
}

function NotificationItem({ notification, onClear }: NotificationItemProps) {
  return (
    <div
      className={`transform transition-all duration-500 ${
        notification.isVisible
          ? 'translate-x-0 opacity-100'
          : 'translate-x-10 opacity-0'
      } pointer-events-auto max-w-sm w-full shadow-lg rounded-lg overflow-hidden`}
    >
      <div className={`
        p-4 flex items-start space-x-3
        ${notification.type === 'success' ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' :
          notification.type === 'error' ? 'bg-gradient-to-r from-red-500 to-red-600 text-white' :
          notification.type === 'warning' ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-800' :
          'bg-gradient-to-r from-blue-500 to-blue-600 text-white'}
      `}>
        <div className="flex-shrink-0">
          {notification.type === 'success' && (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          {notification.type === 'error' && (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          {notification.type === 'warning' && (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          )}
          {notification.type === 'info' && (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </div>
        <div className="flex-1 pt-0.5">
          <p className="text-sm font-medium">{notification.message}</p>
        </div>
        <button
          onClick={() => onClear(notification.id)}
          className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity focus:outline-none"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
