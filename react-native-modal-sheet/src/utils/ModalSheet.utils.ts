import { Dimensions } from 'react-native';
import { SharedValue } from 'react-native-reanimated';
import { DEFAULT_VALUES } from '../constants/ModalSheet.constants';

/**
 * Get screen dimensions
 */
export const getScreenHeight = (): number => {
  return Dimensions.get('window').height;
};

/**
 * Convert snap points to pixel values
 */
export const convertSnapPointsToPixels = (
  snapPoints: (string | number)[] | SharedValue<(string | number)[]> | undefined,
  screenHeight: number
): number[] | null => {
  if (!snapPoints) return null;

  // Extract the actual array from SharedValue if needed
  const pointsArray = (snapPoints as any).value || snapPoints;

  if (!Array.isArray(pointsArray) || pointsArray.length === 0) return null;

  return pointsArray.map((point: string | number) => {
    // Handle string values (e.g., "50%")
    if (typeof point === 'string') {
      if (point.endsWith('%')) {
        const percentage = parseFloat(point) / 100;
        return screenHeight * percentage;
      }
      return parseFloat(point);
    }
    // If numeric value is between 0 and 1, treat as percentage
    if (point > 0 && point <= 1) {
      return screenHeight * point;
    }
    // Otherwise treat as absolute pixel value
    return point;
  });
};

/**
 * Calculate the final height for the modal
 */
export const calculateModalHeight = (
  height: number | undefined,
  snapPointsInPixels: number[] | null
): number | undefined => {
  // If using snap points, always use the LARGEST snap point as container height
  if (snapPointsInPixels && snapPointsInPixels.length > 0) {
    return snapPointsInPixels[snapPointsInPixels.length - 1];
  }

  // If height is explicitly provided, use it
  if (height !== undefined) {
    return height;
  }

  // Otherwise use 'auto' by not setting a fixed height
  return undefined;
};

/**
 * Calculate default max height (90% of screen height)
 */
export const calculateDefaultMaxHeight = (screenHeight: number): number => {
  return screenHeight * DEFAULT_VALUES.DEFAULT_MAX_HEIGHT_PERCENTAGE;
};

/**
 * Get the translateY offset for a given snap index
 */
export const getSnapTranslateY = (
  index: number,
  snapPointsInPixels: number[] | null
): number => {
  if (!snapPointsInPixels || snapPointsInPixels.length === 0) return 0;
  const maxHeight = snapPointsInPixels[snapPointsInPixels.length - 1];
  const targetHeight = snapPointsInPixels[index];
  // Return how much to hide (push down) from the max height
  return maxHeight - targetHeight;
};
