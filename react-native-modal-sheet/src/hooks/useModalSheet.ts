import { useContext } from 'react';
import { ModalSheetContext } from '../contexts/ModalSheetContext';

export const useModalSheet = () => {
  const context = useContext(ModalSheetContext);

  if (context === null) {
    throw "'ModalSheetContext' cannot be null!";
  }

  return context;
};
