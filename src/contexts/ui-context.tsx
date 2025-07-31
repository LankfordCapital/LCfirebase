
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UIContextType {
  isAssistantOpen: boolean;
  setAssistantOpen: (isOpen: boolean) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider = ({ children }: { children: ReactNode }) => {
  const [isAssistantOpen, setAssistantOpen] = useState(false);

  return (
    <UIContext.Provider value={{ isAssistantOpen, setAssistantOpen }}>
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
