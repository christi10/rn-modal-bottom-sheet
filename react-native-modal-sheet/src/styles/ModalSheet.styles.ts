import { StyleSheet } from 'react-native';

export const modalSheetStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  backdropAnimated: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
  },
  sheet: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
    width: '100%',
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingBottom: 20,
    width: '100%',
    backgroundColor: 'transparent',
    minHeight: 44,
  },
  handle: {
    width: 40,
    height: 5,
    borderRadius: 2.5,
  },
  content: {
    flexShrink: 1,
  },
});
