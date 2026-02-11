import React from 'react';
import { Animated, Pressable, View, ViewStyle, Platform } from 'react-native';
import { modalSheetStyles } from '../styles/ModalSheet.styles';

/**
 * Modal Sheet Handle Component
 */
interface ModalSheetHandleProps {
  showHandle: boolean;
  handleColor: string;
  onPress: () => void;
  isScreenReaderEnabled: boolean;
  isMouseDragging: React.MutableRefObject<boolean>;
  handleTouchStart: (e: any) => void;
  handleTouchMove: (e: any) => void;
  handleTouchEnd: (e: any) => void;
  handleMouseDown?: (e: any) => void;
  handleMouseMove?: (e: any) => void;
  handleMouseUp?: (e: any) => void;
}

export const ModalSheetHandle: React.FC<ModalSheetHandleProps> = ({
  showHandle,
  handleColor,
  onPress,
  isScreenReaderEnabled,
  isMouseDragging,
  handleTouchStart,
  handleTouchMove,
  handleTouchEnd,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
}) => {
  if (!showHandle) return null;

  return (
    <View
      style={[
        modalSheetStyles.handleContainer,
        Platform.OS === 'web' && {
          cursor: (isMouseDragging.current ? 'grabbing' : 'grab') as any,
          // @ts-ignore: Web-specific style properties
          userSelect: 'none',
          WebkitUserSelect: 'none',
        },
      ]}
      onTouchStart={isScreenReaderEnabled ? undefined : handleTouchStart}
      onTouchMove={isScreenReaderEnabled ? undefined : handleTouchMove}
      onTouchEnd={isScreenReaderEnabled ? undefined : handleTouchEnd}
      {...(Platform.OS === 'web' && !!isScreenReaderEnabled
        ? {
            onMouseDown: handleMouseDown,
            onMouseMove: handleMouseMove,
            onMouseUp: handleMouseUp,
            onMouseLeave: handleMouseUp, // Handle mouse leaving the area
          }
        : {})}
    >
      <Pressable
        onPress={isScreenReaderEnabled ? onPress : undefined}
        accessible={isScreenReaderEnabled}
        accessibilityElementsHidden={!isScreenReaderEnabled}
        importantForAccessibility={isScreenReaderEnabled ? 'yes' : 'no-hide-descendants'}
        aria-hidden={!isScreenReaderEnabled}
        accessibilityLabel="Close"
        accessibilityRole="button"
        style={({ pressed }) => [
          modalSheetStyles.handle,
          {
            backgroundColor: handleColor,
            opacity: pressed ? 0.6 : 1,
            cursor: Platform.OS === 'web' ? 'pointer' : undefined,
          },
        ]}
      />
    </View>
  );
};

/**
 * Modal Sheet Backdrop Component
 */
interface ModalSheetBackdropProps {
  onPress: () => void;
  backdropAriaLabel: string;
  backdropOpacityAnim: Animated.Value;
  isScreenReaderEnabled: boolean;
}

export const ModalSheetBackdrop: React.FC<ModalSheetBackdropProps> = ({
  onPress,
  backdropAriaLabel,
  backdropOpacityAnim,
  isScreenReaderEnabled,
}) => {
  return (
    <Pressable
      onPress={onPress}
      accessible={!isScreenReaderEnabled}
      accessibilityElementsHidden={isScreenReaderEnabled}
      importantForAccessibility={isScreenReaderEnabled ? 'no-hide-descendants' : 'yes'}
      aria-hidden={isScreenReaderEnabled}
      role={isScreenReaderEnabled ? undefined : 'button'}
      aria-label={isScreenReaderEnabled ? undefined : backdropAriaLabel}
      style={modalSheetStyles.backdrop}
    >
      <Animated.View
        style={[
          modalSheetStyles.backdropAnimated,
          {
            opacity: backdropOpacityAnim,
          },
        ]}
      />
    </Pressable>
  );
};

/**
 * Modal Sheet Content Component
 */
interface ModalSheetContentProps {
  children: React.ReactNode;
  sheetStyles: (ViewStyle | typeof modalSheetStyles.sheet)[];
  ariaLabel?: string;
  ariaDescribedBy?: string;
  sheetAriaProps?: {
    role?: any;
    'aria-modal'?: boolean;
    'aria-hidden'?: boolean;
  };
}

export const ModalSheetContent: React.FC<ModalSheetContentProps> = ({
  children,
  sheetStyles,
  ariaLabel,
  ariaDescribedBy,
  sheetAriaProps,
}) => {
  return (
    <Animated.View
      style={sheetStyles}
      accessibilityRole={sheetAriaProps?.role}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-modal={sheetAriaProps?.['aria-modal'] ?? true}
      aria-hidden={sheetAriaProps?.['aria-hidden'] ?? false}
    >
      <View style={modalSheetStyles.content}>{children}</View>
    </Animated.View>
  );
};
