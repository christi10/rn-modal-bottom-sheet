import { useRef, useState, useCallback, useEffect } from 'react';
import { Animated, Easing } from 'react-native';
import { DEFAULT_VALUES } from '../constants/ModalSheet.constants';
import { getSnapTranslateY } from '../utils/ModalSheet.utils';

/**
 * Custom hook for handling modal sheet animations
 */
export const useModalAnimations = (
  snapPointsInPixels: number[] | null,
  animationDuration: number = DEFAULT_VALUES.DEFAULT_ANIMATION_DURATION,
  backdropOpacity: number = DEFAULT_VALUES.DEFAULT_BACKDROP_OPACITY,
  screenHeight: number,
  currentSnapIndex: number,
  keyboardHeight: number,
  avoidKeyboard: boolean,
  visible: boolean,
  onOpen?: () => void,
  setVisible?: (visible: boolean) => void,
  onClose?: () => void
) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const isImperativelyAnimating = useRef(false);
  const currentAnimation = useRef<Animated.CompositeAnimation | null>(null);
  const translateY = useRef(new Animated.Value(0)).current;
  const backdropOpacityAnim = useRef(new Animated.Value(0)).current;

  // Animate sheet position when keyboard appears/disappears
  useEffect(() => {
    if (!avoidKeyboard || !visible) return undefined;

    // Wait for any opening/closing animation to complete
    if (isImperativelyAnimating.current) {
      // If modal is still opening, wait for it to finish
      const checkInterval = setInterval(() => {
        if (!isImperativelyAnimating.current) {
          clearInterval(checkInterval);
          Animated.timing(translateY, {
            toValue: snapPointsInPixels
              ? getSnapTranslateY(currentSnapIndex, snapPointsInPixels) - keyboardHeight
              : -keyboardHeight,
            duration: 250,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }).start();
        }
      }, 50);

      return () => clearInterval(checkInterval);
    }

    // Animate the sheet up or down based on keyboard height
    Animated.timing(translateY, {
      toValue: snapPointsInPixels
        ? getSnapTranslateY(currentSnapIndex, snapPointsInPixels) - keyboardHeight
        : -keyboardHeight,
      duration: 250,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    return undefined;
  }, [
    keyboardHeight,
    avoidKeyboard,
    visible,
    translateY,
    snapPointsInPixels,
    currentSnapIndex,
  ]);

  // Snap to a specific snap point
  const snapToPoint = useCallback(
    (index: number) => {
      if (!snapPointsInPixels || index < 0 || index >= snapPointsInPixels.length) return;

      const targetTranslateY = getSnapTranslateY(index, snapPointsInPixels);

      setIsAnimating(true);

      // Use timing with smooth bezier easing
      Animated.timing(translateY, {
        toValue: targetTranslateY,
        duration: 280,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        useNativeDriver: true,
      }).start(() => {
        setIsAnimating(false);
      });
    },
    [snapPointsInPixels, translateY]
  );

  const open = useCallback(() => {
    // Prevent opening if already animating imperatively or already visible
    if (isImperativelyAnimating.current || visible) {
      return;
    }

    // Cancel any in-progress animation
    if (currentAnimation.current) {
      currentAnimation.current.stop();
      currentAnimation.current = null;
    }

    isImperativelyAnimating.current = true;
    setVisible?.(true);

    // Set initial translateY position
    const initialTranslateY = snapPointsInPixels
      ? getSnapTranslateY(0, snapPointsInPixels)
      : screenHeight;
    translateY.setValue(initialTranslateY);

    // Animate both backdrop and sheet position
    currentAnimation.current = Animated.parallel([
      Animated.timing(backdropOpacityAnim, {
        toValue: backdropOpacity,
        duration: animationDuration,
        useNativeDriver: true,
      }),
      // Animate sheet sliding in from bottom (only for non-snap mode)
      ...(!snapPointsInPixels
        ? [
            Animated.timing(translateY, {
              toValue: 0,
              duration: animationDuration,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true,
            }),
          ]
        : []),
    ]);

    currentAnimation.current.start(() => {
      currentAnimation.current = null;
      isImperativelyAnimating.current = false;

      // Defer only the callback to avoid useInsertionEffect warning
      setTimeout(() => {
        onOpen?.();
      }, 0);
    });
  }, [
    snapPointsInPixels,
    backdropOpacity,
    animationDuration,
    translateY,
    backdropOpacityAnim,
    screenHeight,
    visible,
    onOpen,
  ]);

  const close = useCallback(() => {
    // Only prevent if already closed (allow swipe gesture to close)
    if (!visible) {
      return;
    }

    // Cancel any in-progress animation
    if (currentAnimation.current) {
      currentAnimation.current.stop();
      currentAnimation.current = null;
    }

    // Set flag to prevent rapid imperative calls, but allow swipe
    isImperativelyAnimating.current = true;

    currentAnimation.current = Animated.parallel([
      Animated.timing(backdropOpacityAnim, {
        toValue: 0,
        duration: animationDuration,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: screenHeight + 100, // Move completely off screen + extra margin
        duration: animationDuration * 0.8,
        useNativeDriver: true,
      }),
    ]);

    currentAnimation.current.start(() => {
      currentAnimation.current = null;
      isImperativelyAnimating.current = false;

      // Defer state updates to avoid useInsertionEffect warning
      setTimeout(() => {
        setVisible?.(false);
        onClose?.();
      }, 0);
    });
  }, [animationDuration, screenHeight, translateY, backdropOpacityAnim, visible, setVisible, onClose]);

  return {
    translateY,
    backdropOpacityAnim,
    isAnimating,
    isImperativelyAnimating,
    currentAnimation,
    snapToPoint,
    open,
    close,
  };
};
