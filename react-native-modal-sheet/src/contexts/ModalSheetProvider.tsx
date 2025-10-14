import React, { useRef, useCallback, useMemo } from 'react';
import { ModalSheetContext } from './ModalSheetContext';
import { ModalSheetRef } from '../types/ModalSheet.types';

interface ModalSheetProviderProps {
  children: React.ReactNode;
}

export const ModalSheetProvider: React.FC<ModalSheetProviderProps> = ({ children }) => {
  const modalsRef = useRef<Map<string, ModalSheetRef>>(new Map());

  const registerModal = useCallback((key: string, ref: ModalSheetRef) => {
    modalsRef.current.set(key, ref);
  }, []);

  const unregisterModal = useCallback((key: string) => {
    modalsRef.current.delete(key);
  }, []);

  const dismiss = useCallback((key?: string) => {
    if (key) {
      // Dismiss specific modal by key
      const modal = modalsRef.current.get(key);
      if (modal) {
        modal.dismiss();
      }
    } else {
      // Dismiss the last presented modal
      const modals = Array.from(modalsRef.current.values());
      if (modals.length > 0) {
        modals[modals.length - 1].dismiss();
      }
    }
  }, []);

  const dismissAll = useCallback(() => {
    // Dismiss all modals
    modalsRef.current.forEach((modal) => {
      modal.dismiss();
    });
  }, []);

  const contextValue = useMemo(
    () => ({
      dismiss,
      dismissAll,
      registerModal,
      unregisterModal,
    }),
    [dismiss, dismissAll, registerModal, unregisterModal]
  );

  return (
    <ModalSheetContext.Provider value={contextValue}>
      {children}
    </ModalSheetContext.Provider>
  );
};
