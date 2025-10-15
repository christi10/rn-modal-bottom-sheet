import React, {
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
  useState,
  useMemo,
  useCallback,
  useContext,
} from 'react';
import {
  View,
  Modal,
  Animated,
  ViewStyle,
  Easing,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Types and interfaces
import { ModalSheetProps, ModalSheetRef } from './types/ModalSheet.types';

// Context
import { ModalSheetContext } from './contexts/ModalSheetContext';

// Constants
import { DEFAULT_VALUES } from './constants/ModalSheet.constants';

// Utils
import {
  getScreenHeight,
  convertSnapPointsToPixels,
  calculateModalHeight,
  calculateDefaultMaxHeight,
} from './utils/ModalSheet.utils';

// Styles
import { modalSheetStyles } from './styles/ModalSheet.styles';

// Hooks
import { useKeyboardHandler } from './hooks/useKeyboardHandler';
import { useModalAnimations } from './hooks/useModalAnimations';
import { useTouchHandler } from './hooks/useTouchHandler';
import { useScrollHandler } from './hooks/useScrollHandler';

// Components
import {
  ModalSheetHandle,
  ModalSheetBackdrop,
  ModalSheetContent,
} from './components/ModalSheetComponents';

const ModalSheet = forwardRef<ModalSheetRef, ModalSheetProps>(
  (
    {
      children,
      name,
      enableDragAndDrop = false,
      avoidKeyboard = false,
      keyboardOffset = 0,
      height,
      maxHeight,
      snapPoints,
      initialSnapIndex = DEFAULT_VALUES.DEFAULT_INITIAL_SNAP_INDEX,
      enableScrollToExpand = true,
      scrollExpandThreshold = DEFAULT_VALUES.DEFAULT_SCROLL_EXPAND_THRESHOLD,
      onSnapPointChange,
      onClose,
      onOpen,
      backgroundColor = DEFAULT_VALUES.DEFAULT_BACKGROUND_COLOR,
      borderRadius = DEFAULT_VALUES.DEFAULT_BORDER_RADIUS,
      showHandle = true,
      handleColor = DEFAULT_VALUES.DEFAULT_HANDLE_COLOR,
      backdropOpacity = DEFAULT_VALUES.DEFAULT_BACKDROP_OPACITY,
      dragThreshold = DEFAULT_VALUES.DEFAULT_DRAG_THRESHOLD,
      animationDuration = DEFAULT_VALUES.DEFAULT_ANIMATION_DURATION,
      containerStyle,
      modalProps,
      // Accessibility props
      'aria-label': ariaLabel = 'Bottom sheet',
      'aria-describedby': ariaDescribedBy,
      backdropAriaLabel = 'Close bottom sheet',
      sheetAriaProps = {},
    },
    ref
  ) => {
    // Context
    const modalSheetContext = useContext(ModalSheetContext);

    // State management
    const [visible, setVisible] = useState(false);
    const visibleRef = useRef(visible);
    const [currentSnapIndex, setCurrentSnapIndex] = useState(initialSnapIndex);
    const modalIdRef = useRef(name || `modal-sheet-${Math.random().toString(36).substr(2, 9)}`);

    // Keep visibleRef in sync with visible state
    useEffect(() => {
      visibleRef.current = visible;
    }, [visible]);

    // Get screen dimensions and calculate values
    const screenHeight = useMemo(() => getScreenHeight(), []);
    const defaultMaxHeight = useMemo(() => calculateDefaultMaxHeight(screenHeight), [screenHeight]);
    const effectiveMaxHeight = maxHeight ?? defaultMaxHeight;

    // Convert snap points to pixel values
    const snapPointsInPixels = useMemo(
      () => convertSnapPointsToPixels(snapPoints, screenHeight),
      [snapPoints, screenHeight]
    );

    // Calculate the final height for the modal
    const calculatedHeight = useMemo(
      () => calculateModalHeight(height, snapPointsInPixels),
      [height, snapPointsInPixels]
    );

    // Custom hooks
    const keyboardHeight = useKeyboardHandler(avoidKeyboard, keyboardOffset);

    const {
      translateY,
      backdropOpacityAnim,
      snapToPoint: animateToSnapPoint,
      open,
      close,
    } = useModalAnimations(
      snapPointsInPixels,
      animationDuration,
      backdropOpacity,
      screenHeight,
      currentSnapIndex,
      keyboardHeight,
      avoidKeyboard,
      visible,
      onOpen,
      setVisible,
      onClose
    );

    const { isMouseDragging, findTargetSnapIndex, ...touchHandlers } = useTouchHandler(
      translateY,
      snapPointsInPixels,
      currentSnapIndex,
      false, // isAnimating - we'll use this later if needed
      dragThreshold
    );

    const { handleScroll, handleScrollBeginDrag, handleScrollEndDrag } = useScrollHandler(
      enableScrollToExpand,
      snapPointsInPixels,
      currentSnapIndex,
      scrollExpandThreshold,
      animateToSnapPoint,
      close
    );

    // Enhanced snap to point with state management
    const snapToPoint = useCallback(
      (index: number) => {
        if (!snapPointsInPixels || index < 0 || index >= snapPointsInPixels.length) return;

        // Update state
        setCurrentSnapIndex(index);
        onSnapPointChange?.(index);

        // Animate to the target snap point
        animateToSnapPoint(index);
      },
      [snapPointsInPixels, onSnapPointChange, animateToSnapPoint]
    );

    // Handle touch end with snap behavior
    const handleTouchEndWithSnap = useCallback(
      (e: any) => {
        const touchResult = touchHandlers.handleTouchEnd(e);

        if (snapPointsInPixels && snapPointsInPixels.length > 0) {
          if (touchResult === 'close') {
            close();
            return;
          }

          if (typeof touchResult === 'number') {
            snapToPoint(touchResult);
          }
        } else {
          if (touchResult === 'close') {
            close();
          } else if (touchResult === 'reset') {
            // Animate back to position 0 for non-snap mode
            Animated.timing(translateY, {
              toValue: 0,
              duration: 50,
              easing: Easing.out(Easing.ease),
              useNativeDriver: true,
            }).start();
          }
        }
      },
      [touchHandlers, snapPointsInPixels, close, snapToPoint, translateY]
    );

    // Handle mouse up with snap behavior
    const handleMouseUpWithSnap = useCallback(
      (e: any) => {
        const mouseResult = touchHandlers.handleMouseUp(e);

        if (snapPointsInPixels && snapPointsInPixels.length > 0) {
          if (mouseResult === 'close') {
            close();
            return;
          }

          if (typeof mouseResult === 'number') {
            snapToPoint(mouseResult);
          }
        } else {
          if (mouseResult === 'close') {
            close();
          } else if (mouseResult === 'reset') {
            // Animate back to position 0 for non-snap mode
            Animated.timing(translateY, {
              toValue: 0,
              duration: 50,
              easing: Easing.out(Easing.ease),
              useNativeDriver: true,
            }).start();
          }
        }
      },
      [touchHandlers, snapPointsInPixels, close, snapToPoint, translateY]
    );

    // Expose imperative methods through ref
    const modalSheetRef = useMemo(
      () => ({
        open,
        close,
        present: open,
        dismiss: close,
        snapToPoint,
        handleScroll,
        handleScrollBeginDrag,
        handleScrollEndDrag,
      }),
      [open, close, snapToPoint, handleScroll, handleScrollBeginDrag, handleScrollEndDrag]
    );

    useImperativeHandle(ref, () => modalSheetRef, [modalSheetRef]);

    // Register/unregister modal with context provider
    useEffect(() => {
      if (modalSheetContext && modalIdRef.current) {
        modalSheetContext.registerModal(modalIdRef.current, modalSheetRef);

        return () => {
          modalSheetContext.unregisterModal(modalIdRef.current);
        };
      }
      return undefined;
    }, [modalSheetContext, modalSheetRef]);

    // Reset animation values when modal is not visible
    useEffect(() => {
      if (!visible) {
        translateY.setValue(screenHeight + 100);
        backdropOpacityAnim.setValue(0);
      }
    }, [visible, screenHeight, translateY, backdropOpacityAnim]);

    // Compute sheet styles for cleaner code
    const sheetStyles = useMemo(() => {
      const baseStyles: (ViewStyle | typeof modalSheetStyles.sheet)[] = [
        modalSheetStyles.sheet,
        {
          ...(calculatedHeight !== undefined && {
            height: calculatedHeight,
          }),
          maxHeight: effectiveMaxHeight,
          backgroundColor,
          borderTopLeftRadius: borderRadius,
          borderTopRightRadius: borderRadius,
          transform: [{ translateY: translateY }],
        },
      ];

      // Add container style if provided
      if (containerStyle) {
        baseStyles.push(containerStyle);
      }

      return baseStyles;
    }, [
      calculatedHeight,
      effectiveMaxHeight,
      backgroundColor,
      borderRadius,
      translateY,
      containerStyle,
    ]);

    // Create the modal content
    const modalContent = (
      <View style={modalSheetStyles.container}>
        <ModalSheetBackdrop
          onPress={close}
          backdropAriaLabel={backdropAriaLabel}
          backdropOpacityAnim={backdropOpacityAnim}
        />

        <ModalSheetContent
          sheetStyles={sheetStyles}
          ariaLabel={ariaLabel}
          ariaDescribedBy={ariaDescribedBy}
          sheetAriaProps={sheetAriaProps}
        >
          <ModalSheetHandle
            showHandle={showHandle}
            handleColor={handleColor}
            onPress={close}
            isMouseDragging={isMouseDragging}
            handleTouchStart={touchHandlers.handleTouchStart}
            handleTouchMove={touchHandlers.handleTouchMove}
            handleTouchEnd={handleTouchEndWithSnap}
            handleMouseDown={touchHandlers.handleMouseDown}
            handleMouseMove={touchHandlers.handleMouseMove}
            handleMouseUp={handleMouseUpWithSnap}
          />
          {children}
        </ModalSheetContent>
      </View>
    );

    return (
      <Modal
        animationType={'fade'}
        transparent={true}
        visible={visible}
        onRequestClose={close}
        statusBarTranslucent
        aria-modal={true}
        {...modalProps}
      >
        {enableDragAndDrop ? (
          <GestureHandlerRootView style={{ flex: 1 }}>{modalContent}</GestureHandlerRootView>
        ) : (
          modalContent
        )}
      </Modal>
    );
  }
);

export default ModalSheet;
