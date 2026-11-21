// src/hooks/useKeyboardEvent.tsx
'use client';

import { useEffect, useRef, useCallback } from 'react';

interface KeyHandlers {
  [key: string]: (event: KeyboardEvent) => void;
}

export interface KeyboardEventOptions {
  preventDefault?: boolean;
  stopPropagation?: boolean;
  priority?: number; // Higher numbers = higher priority
}

// save all registered keyboard handlers globally
const globalKeyHandlers: {
  [key: string]: Array<{
    handler: (event: KeyboardEvent) => void;
    priority: number;
    options: KeyboardEventOptions;
  }>;
} = {};

// global event handler function
const handleGlobalKeyDown = (event: KeyboardEvent) => {
  const key = event.key;
  
  if (globalKeyHandlers[key]) {
    // sort handlers by priority
    const sortedHandlers = [...globalKeyHandlers[key]].sort((a, b) => b.priority - a.priority);
    
    for (const { handler, options } of sortedHandlers) {
      if (options.preventDefault) {
        event.preventDefault();
      }
      if (options.stopPropagation) {
        event.stopPropagation();
      }
      
      handler(event);
      // once the handler is executed, stop executing other handlers
      break;
    }
  }
};

// initialize global event listener
let isInitialized = false;
function initGlobalListener() {
  if (!isInitialized && typeof window !== 'undefined') {
    window.addEventListener('keydown', handleGlobalKeyDown);
    isInitialized = true;
  }
}

export function useKeyboardEvent(
  keyHandlers: KeyHandlers,
  options: KeyboardEventOptions = { preventDefault: true, stopPropagation: true, priority: 1 }
) {
  const handlerRefs = useRef<string[]>([]);
  
  const unregisterHandlers = useCallback(() => {
    handlerRefs.current.forEach(key => {
      if (globalKeyHandlers[key]) {
        globalKeyHandlers[key] = globalKeyHandlers[key].filter(
          handler => handler.priority !== options.priority
        );
        
        if (globalKeyHandlers[key].length === 0) {
          delete globalKeyHandlers[key];
        }
      }
    });
    handlerRefs.current = [];
  }, [options.priority]);
  
  useEffect(() => {
    initGlobalListener();
    
    // clear previous registered handlers
    unregisterHandlers();
    
    // register new handlers
    Object.entries(keyHandlers).forEach(([key, handler]) => {
      if (!globalKeyHandlers[key]) {
        globalKeyHandlers[key] = [];
      }
      
      globalKeyHandlers[key].push({
        handler,
        priority: options.priority || 1,
        options
      });
      
      handlerRefs.current.push(key);
    });
    
    return unregisterHandlers;
  }, [keyHandlers, options, unregisterHandlers]);
}