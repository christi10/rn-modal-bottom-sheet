// ModalSheet types and interfaces
import React from 'react';
import {
  NativeSyntheticEvent,
  NativeScrollEvent,
  AccessibilityRole,
  ViewStyle,
  ModalProps,
} from 'react-native';
import { SharedValue } from 'react-native-reanimated';

export interface ModalSheetRef {
  open: () => void;
  close: () => void;
  present: () => void;
  dismiss: () => void;
  snapToPoint: (index: number) => void;
  handleScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  handleScrollBeginDrag: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  handleScrollEndDrag: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
}

export interface ModalSheetAccessibilityProps {
  'aria-label'?: string;
  'aria-describedby'?: string;
  backdropAriaLabel?: string;
  sheetAriaProps?: {
    role?: AccessibilityRole;
    'aria-modal'?: boolean;
    'aria-hidden'?: boolean;
  };
}

export interface ModalSheetProps extends ModalSheetAccessibilityProps {
  children: React.ReactNode;
  enableDragAndDrop?: boolean;
  avoidKeyboard?: boolean;
  keyboardOffset?: number;
  height?: number;
  maxHeight?: number;
  minHeight?: number;
  snapPoints?: (string | number)[] | SharedValue<(string | number)[]>;
  initialSnapIndex?: number;
  enableScrollToExpand?: boolean;
  scrollExpandThreshold?: number;
  onSnapPointChange?: (index: number) => void;
  isVisible?: boolean;
  onClose?: () => void;
  onOpen?: () => void;
  backgroundColor?: string;
  borderRadius?: number;
  showHandle?: boolean;
  handleColor?: string;
  backdropOpacity?: number;
  dragThreshold?: number;
  animationDuration?: number;
  springDamping?: number;
  containerStyle?: ViewStyle;
  modalProps?: Partial<ModalProps>;
}
