import { createContext } from 'react';
import { ModalSheetRef } from '../types/ModalSheet.types';

export const ModalSheetContext = createContext<ModalSheetRef | null>(null);
