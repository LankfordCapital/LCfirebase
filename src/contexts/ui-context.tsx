
'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface UIContextType {
  isAssistantOpen: boolean;
  assistantContext: string | null;
  openAssistant: (context?: string) => void;
  closeAssistant: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider = ({ children }: { children: ReactNode }) => {
  const [isAssistantOpen, setAssistantOpen] = useState(false);
  const [assistantContext, setAssistantContext] = useState<string | null>(null);

  const openAssistant = useCallback((context?: string) => {
    if (context) {
      setAssistantContext(context);
    }
    setAssistantOpen(true);
  }, []);

  const closeAssistant = useCallback(() => {
    setAssistantOpen(false);
    // Reset context after a delay to allow the sheet to close
    setTimeout(() => {
      setAssistantContext(null);
    }, 300);
  }, []);

  return (
    <UIContext.Provider value={{ isAssistantOpen, assistantContext, openAssistant, closeAssistant }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};
