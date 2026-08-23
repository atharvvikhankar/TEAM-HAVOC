"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import ConfirmModal from "@/components/ConfirmModal";

type ConfirmOptions = {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
};

type UIContextType = {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
};

const UIContext = createContext<UIContextType | null>(null);

export function UIProvider({ children }: { children: ReactNode }) {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    options: ConfirmOptions | null;
    resolve: ((value: boolean) => void) | null;
  }>({
    isOpen: false,
    options: null,
    resolve: null,
  });

  const confirm = (options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setModalState({
        isOpen: true,
        options,
        resolve,
      });
    });
  };

  const handleConfirm = () => {
    if (modalState.resolve) modalState.resolve(true);
    setModalState({ isOpen: false, options: null, resolve: null });
  };

  const handleCancel = () => {
    if (modalState.resolve) modalState.resolve(false);
    setModalState({ isOpen: false, options: null, resolve: null });
  };

  return (
    <UIContext.Provider value={{ confirm }}>
      {children}
      <ConfirmModal 
        isOpen={modalState.isOpen}
        options={modalState.options}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </UIContext.Provider>
  );
}

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) throw new Error("useUI must be used within UIProvider");
  return context;
};
