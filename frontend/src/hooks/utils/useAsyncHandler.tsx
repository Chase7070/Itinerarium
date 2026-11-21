// src/hooks/useAsyncHandler.tsx
'use client';

import { useState, useCallback } from 'react';
import { useNotification } from '@/contexts/notification/NotificationContext';

export interface AsyncHandlerOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
  successMessage?: string;
  errorMessage?: string;
}

export function useAsyncHandler() {
  const [isLoading, setIsLoading] = useState(false);
  const { showNotification } = useNotification();

  const handleAsync = useCallback(async <T,>(
    asyncFn: () => Promise<T>,
    options?: AsyncHandlerOptions
  ): Promise<T | null> => {
    setIsLoading(true);
    try {
      const result = await asyncFn();
      
      if (options?.successMessage) {
        showNotification(options.successMessage, 'success');
      }
      
      if (options?.onSuccess) {
        options.onSuccess(result);
      }
      
      return result;
    } catch (error) {
      const errorObj = error as Error;
      console.error('Async operation failed:', errorObj);
      
      if (options?.errorMessage) {
        showNotification(options.errorMessage, 'error');
      } else {
        showNotification(`operation failed: ${errorObj.message}`, 'error');
      }
      
      if (options?.onError) {
        options.onError(errorObj);
      }
      
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [showNotification]);

  return { handleAsync, isLoading };
}