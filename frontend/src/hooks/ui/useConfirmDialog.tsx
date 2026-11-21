// src/hooks/useConfirmDialog.tsx
'use client';

import { useState, useCallback } from 'react';
import { useKeyboardEvent } from '@/hooks/ui/useKeyboardEvent';

export type DialogVariant = 'danger' | 'warning' | 'primary' | 'info';

export interface ConfirmDialogState {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void | Promise<void>;
  variant?: DialogVariant;
}

const initialState: ConfirmDialogState = {
  isOpen: false,
  title: '',
  message: '',
  onConfirm: () => {},
  variant: 'primary'
};

export function useConfirmDialog() {
  const [dialog, setDialog] = useState<ConfirmDialogState>(initialState);
  
  const openDialog = useCallback((
    title: string,
    message: string,
    onConfirm: () => void | Promise<void>,
    variant: DialogVariant = 'primary'
  ) => {
    setDialog({
      isOpen: true,
      title,
      message,
      onConfirm,
      variant
    });
  }, []);
  
  const closeDialog = useCallback(() => {
    setDialog(prev => ({ ...prev, isOpen: false }));
  }, []);
  
  // when dialog is open, use high priority to hijack keyboard events
  useKeyboardEvent(
    {
      'Escape': () => { 
        if (dialog.isOpen) closeDialog();
      },
      'Enter': () => { 
        if (dialog.isOpen) {
          dialog.onConfirm();
          closeDialog();
        }
      }
    },
    { priority: 10, preventDefault: true, stopPropagation: true }
  );
  
  return {
    dialog,
    openDialog,
    closeDialog
  };
}