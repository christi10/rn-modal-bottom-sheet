import { createContext } from 'react';
import { ModalSheetRef } from '../types/ModalSheet.types';

export interface ModalSheetContextType {
  dismiss: (key?: string) => void;
  dismissAll: () => void;
  registerModal: (key: string, ref: ModalSheetRef) => void;
  unregisterModal: (key: string) => void;
}

export const ModalSheetContext = createContext<ModalSheetContextType | null>(null);
