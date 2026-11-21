import React, { useEffect } from 'react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'danger' | 'warning' | 'primary';
  onConfirm: () => void;
  onCancel: () => void;
  position?: 'inline' | 'centered';
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'confirm',
  cancelText = 'cancel',
  confirmVariant = 'danger',
  onConfirm,
  onCancel,
  position = 'centered'
}) => {
  // keyboard listener - ESC close, Enter confirm
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      e.stopPropagation();
      
      if (e.key === 'Escape') {
        e.preventDefault();
        onCancel();
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        onConfirm();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [isOpen, onCancel, onConfirm]);

  if (!isOpen) return null;

  // button styles change according to variant
  const buttonStyles = {
    danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    warning: 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500',
    primary: 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
  };

  // dialog content - used for both inline and centered dialogs
  const dialogContent = (
    <>
      {/* content area */}
      <div className="px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
        <div className="sm:flex sm:items-start">
          {/* icon area - only show in non-inline mode */}
          {position === 'centered' && (
            <div className={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${
                confirmVariant === 'danger' ? 'bg-red-100 dark:bg-red-900/30' : 
                confirmVariant === 'warning' ? 'bg-amber-100 dark:bg-amber-900/30' : 
                'bg-indigo-100 dark:bg-indigo-900/30'
              } sm:mx-0 sm:h-10 sm:w-10`}>
              {confirmVariant === 'danger' ? (
                <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              ) : confirmVariant === 'warning' ? (
                <svg className="h-6 w-6 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              ) : (
                <svg className="h-6 w-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              )}
            </div>
          )}
          
          {/* text content area - fix: use div instead of p */}
          <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
              {title}
            </h3>
            <div className="mt-2">
              {/* key fix: use div instead of p to wrap message */}
              <div className="text-sm text-gray-500 dark:text-gray-300">
                {message}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* button area */}
      <div className="bg-gray-50 dark:bg-gray-700/50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
        <button
          type="button"
          className={`inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto ${buttonStyles[confirmVariant]}`}
          onClick={async (e) => {
            e.stopPropagation();
            try {
              await onConfirm();
            } catch (error) {
              console.error("Error in confirmation action:", error);
            }
          }}
        >
          {confirmText}
        </button>
        <button
          type="button"
          className="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-gray-800 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-gray-200 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:mt-0 sm:w-auto"
          onClick={onCancel}
          autoFocus
        >
          {cancelText}
        </button>
      </div>
    </>
  );

  // select render method according to position mode
  if (position === 'inline') {
    return (
      <div className="relative z-10 rounded-lg bg-white dark:bg-gray-800 text-left shadow-md border border-gray-200 dark:border-gray-700 my-4 overflow-hidden">
        {dialogContent}
      </div>
    );
  }

  // default centered modal dialog - remove background mask
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby={title} role="dialog" aria-modal="true">
      {/* removed background mask */}
      
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        {/* dialog card */}
        <div 
          className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-lg border border-gray-200 dark:border-gray-700 transition-all animate-dialogIn sm:my-8 sm:w-full sm:max-w-lg"
          onClick={e => e.stopPropagation()}
        >
          {dialogContent}
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;