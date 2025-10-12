import { useRef, useCallback, useEffect } from 'react';
import { GestureResponderEvent, Platform } from 'react-native';
import { Animated } from 'react-native';
import { DEFAULT_VALUES } from '../constants/ModalSheet.constants';
import { getSnapTranslateY } from '../utils/ModalSheet.utils';

/**
 * Custom hook for handling touch and mouse interactions with the modal sheet
 */
export const useTouchHandler = (
  translateY: Animated.Value,
  snapPointsInPixels: number[] | null,
  currentSnapIndex: number,
  isAnimating: boolean,
  dragThreshold: number = DEFAULT_VALUES.DEFAULT_DRAG_THRESHOLD
) => {
  // Touch gesture tracking
  const touchStartY = useRef(0);
  const touchStartTranslateY = useRef(0);
  const isDragging = useRef(false);
  const isMouseDragging = useRef(false);

  // Helper: Find target snap index based on current position
  const findTargetSnapIndex = useCallback(
    (currentTranslateY: number): number | 'close' => {
      if (!snapPointsInPixels || snapPointsInPixels.length === 0) return currentSnapIndex;

      const maxSnapTranslateY = getSnapTranslateY(0, snapPointsInPixels);

      // Check if should close (dragged beyond smallest snap + threshold)
      if (currentTranslateY > maxSnapTranslateY + dragThreshold) {
        return 'close';
      }

      // Find closest snap point to current translateY position
      let targetIndex = 0;
      let minDistance = Infinity;

      for (let i = 0; i < snapPointsInPixels.length; i++) {
        const snapTranslateY = getSnapTranslateY(i, snapPointsInPixels);
        const distance = Math.abs(currentTranslateY - snapTranslateY);
        if (distance < minDistance) {
          minDistance = distance;
          targetIndex = i;
        }
      }

      return targetIndex;
    },
    [snapPointsInPixels, currentSnapIndex, dragThreshold]
  );

  // Handle touch start
  const handleTouchStart = useCallback(
    (e: GestureResponderEvent) => {
      // Prevent touch interactions during animation
      if (isAnimating) return;

      touchStartY.current = e.nativeEvent.pageY;
      touchStartTranslateY.current = (translateY as any)._value || 0;
      isDragging.current = true;
    },
    [translateY, isAnimating]
  );

  // Handle touch move
  const handleTouchMove = useCallback(
    (e: GestureResponderEvent) => {
      if (!isDragging.current) return;

      const deltaY = e.nativeEvent.pageY - touchStartY.current;
      const newTranslateY = touchStartTranslateY.current + deltaY;

      // If using snap points
      if (snapPointsInPixels && snapPointsInPixels.length > 0) {
        const maxSnapTranslateY = getSnapTranslateY(snapPointsInPixels.length - 1, snapPointsInPixels);

        // Only prevent swiping UP (negative deltaY) when at maximum height
        if (
          currentSnapIndex === snapPointsInPixels.length - 1 &&
          newTranslateY < maxSnapTranslateY
        ) {
          // Lock at maximum height - don't allow upward movement beyond max
          translateY.setValue(maxSnapTranslateY);
          return;
        }

        // Allow all downward movement (deltaY > 0 means dragging down)
        // This allows collapsing from any snap point
      }

      // For non-snap mode, prevent upward dragging beyond 0
      if (!snapPointsInPixels && newTranslateY < 0) {
        translateY.setValue(0);
        return;
      }

      // Apply translateY for immediate visual feedback during drag
      translateY.setValue(newTranslateY);
    },
    [translateY, snapPointsInPixels, currentSnapIndex]
  );

  // Handle touch end
  const handleTouchEnd = useCallback(
    (e: GestureResponderEvent) => {
      if (!isDragging.current) return;
      isDragging.current = false;

      const currentTranslateY = (translateY as any)._value || 0;

      // Handle snap points behavior
      if (snapPointsInPixels && snapPointsInPixels.length > 0) {
        const target = findTargetSnapIndex(currentTranslateY);

        if (target === 'close') {
          return 'close';
        }

        return target;
      } else {
        const deltaY = e.nativeEvent.pageY - touchStartY.current;
        // Original behavior without snap points
        const isSwipeDown = deltaY > dragThreshold;

        if (isSwipeDown && deltaY > 0) {
          return 'close';
        } else {
          return 'reset';
        }
      }
    },
    [snapPointsInPixels, findTargetSnapIndex, translateY, dragThreshold]
  );

  // Handle mouse events for web platform
  const handleMouseDown = useCallback(
    (e: any) => {
      // Prevent default to avoid text selection during drag
      e.preventDefault?.();

      // Prevent if animating
      if (isAnimating) return;

      const pageY = e.pageY || e.clientY;
      touchStartY.current = pageY;
      touchStartTranslateY.current = (translateY as any)._value || 0;
      isMouseDragging.current = true;
    },
    [translateY, isAnimating]
  );

  const handleMouseMove = useCallback(
    (e: any) => {
      if (!isMouseDragging.current) return;

      const pageY = e.pageY || e.clientY;
      const deltaY = pageY - touchStartY.current;
      const newTranslateY = touchStartTranslateY.current + deltaY;

      // If using snap points
      if (snapPointsInPixels && snapPointsInPixels.length > 0) {
        const maxSnapTranslateY = getSnapTranslateY(snapPointsInPixels.length - 1, snapPointsInPixels);

        // Only prevent swiping UP (negative deltaY) when at maximum height
        if (
          currentSnapIndex === snapPointsInPixels.length - 1 &&
          newTranslateY < maxSnapTranslateY
        ) {
          // Lock at maximum height
          translateY.setValue(maxSnapTranslateY);
          return;
        }
      }

      // For non-snap mode, prevent upward dragging beyond 0
      if (!snapPointsInPixels && newTranslateY < 0) {
        translateY.setValue(0);
        return;
      }

      // Apply translateY for immediate visual feedback during drag
      translateY.setValue(newTranslateY);
    },
    [translateY, snapPointsInPixels, currentSnapIndex]
  );

  const handleMouseUp = useCallback(
    (e: any) => {
      if (!isMouseDragging.current) return;
      isMouseDragging.current = false;

      const pageY = e.pageY || e.clientY;
      const currentTranslateY = (translateY as any)._value || 0;

      // Handle snap points behavior
      if (snapPointsInPixels && snapPointsInPixels.length > 0) {
        const target = findTargetSnapIndex(currentTranslateY);

        if (target === 'close') {
          return 'close';
        }

        return target;
      } else {
        const deltaY = pageY - touchStartY.current;
        // Original behavior without snap points
        const isSwipeDown = deltaY > dragThreshold;

        if (isSwipeDown && deltaY > 0) {
          return 'close';
        } else {
          return 'reset';
        }
      }
    },
    [
      snapPointsInPixels,
      findTargetSnapIndex,
      translateY,
      dragThreshold,
    ]
  );

  // Add global mouse event listeners for web platform
  useEffect(() => {
    // Only set up listeners on web platform
    if (
      Platform.OS === 'web' &&
      typeof globalThis !== 'undefined' &&
      (globalThis as any).document
    ) {
      const handleGlobalMouseUp = (e: MouseEvent) => {
        if (isMouseDragging.current) {
          handleMouseUp(e);
        }
      };

      const handleGlobalMouseMove = (e: MouseEvent) => {
        if (isMouseDragging.current) {
          handleMouseMove(e);
        }
      };

      const doc = (globalThis as any).document;
      doc.addEventListener('mouseup', handleGlobalMouseUp);
      doc.addEventListener('mousemove', handleGlobalMouseMove);

      return () => {
        doc.removeEventListener('mouseup', handleGlobalMouseUp);
        doc.removeEventListener('mousemove', handleGlobalMouseMove);
      };
    }

    // Return undefined for all other cases
    return undefined;
  }, [handleMouseUp, handleMouseMove]);

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    findTargetSnapIndex,
    isDragging,
    isMouseDragging,
  };
};
