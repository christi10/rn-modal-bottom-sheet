import { useContext } from 'react';
import { ModalSheetContext } from '../contexts/ModalSheetContext';

export const useModalSheet = () => {
  const context = useContext(ModalSheetContext);

  if (context === null) {
    throw new Error("'ModalSheetContext' cannot be null! Make sure your component is wrapped with ModalSheetProvider.");
  }

  return context;
};
