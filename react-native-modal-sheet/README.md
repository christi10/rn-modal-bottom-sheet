# rn-modal-bottom-sheet

[![npm version](https://img.shields.io/npm/v/rn-modal-bottom-sheet.svg)](https://www.npmjs.com/package/rn-modal-bottom-sheet)
[![npm downloads](https://img.shields.io/npm/dt/rn-modal-bottom-sheet.svg)](https://www.npmjs.com/package/rn-modal-bottom-sheet)
[![GitHub stars](https://img.shields.io/github/stars/christi10/ModalSheet.svg?style=social)](https://github.com/christi10/ModalSheet)

**rn-modal-bottom-sheet** is a performant, gesture-enabled bottom sheet component for React Native with snap points, scroll-to-expand, and pull-to-collapse functionality. Zero native dependencies, works seamlessly with Expo!

## 📱 Demo

> 🎥 **[Click here to view Demo Video](https://github.com/christi10/ModalSheet/blob/main/docs/assets/modal-sheet-demo.mp4)** - See the modal sheet in action with snap points, scroll-to-expand, and smooth animations!

<!-- Video will be embedded here after uploading through GitHub issue -->
<!-- To embed:
1. Go to https://github.com/christi10/ModalSheet/issues
2. Create a new issue or open an existing one
3. Drag and drop the modal-sheet-demo.mp4 file into the comment box
4. GitHub will generate a URL like: https://github.com/user-attachments/assets/[id]
5. Replace this comment with that URL
-->

<p align="center">
  <img src="https://img.shields.io/npm/v/rn-modal-bottom-sheet" alt="npm version">
  <img src="https://img.shields.io/badge/platform-ios%20%7C%20android-lightgrey.svg" alt="Platforms">
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License">
  <img src="https://img.shields.io/badge/typescript-supported-blue.svg" alt="TypeScript">
</p>

## ✨ Features

- 🎯 **Snap Points** - Multiple snap positions with intelligent detection
- 📜 **Scroll-to-Expand** - Automatically expand to next snap point while scrolling
- 👆 **Pull-to-Collapse** - Pull down at the top to collapse or close
- 🎨 **Smooth Animations** - Buttery smooth bezier easing with 60fps performance
- 🚀 **High Performance** - Transform-based animations, no layout recalculations
- 🎯 **Zero Native Dependencies** - Built with React Native's Animated API
- 📱 **Cross Platform** - Works on both iOS and Android
- 🎭 **Backdrop Animation** - Independent opacity animation for backdrop
- 👆 **Gesture Support** - Drag to close with customizable threshold
- 🎨 **Fully Customizable** - Customize colors, dimensions, and animations
- 📦 **Lightweight** - Minimal overhead, no external dependencies
- ♿ **ARIA Compliant** - Full accessibility support with ARIA attributes
- 🔒 **TypeScript Support** - Full TypeScript definitions included

## 📦 Installation

```bash
npm install rn-modal-bottom-sheet react-native-safe-area-context
# or
yarn add rn-modal-bottom-sheet react-native-safe-area-context
```

### Peer Dependencies

This package requires the following peer dependencies:
- `react-native-safe-area-context` (>=3.0.0)
- `react-native-gesture-handler` (>=2.0.0) - Only needed if using `enableDragAndDrop`
- `react-native-reanimated` (>=2.0.0) - Only needed if using `SharedValue` for snap points

## 🚀 Quick Start

### Basic Usage

```tsx
import React, { useRef } from 'react';
import { Button, Text, View } from 'react-native';
import ModalSheet, { ModalSheetRef } from 'rn-modal-bottom-sheet';

function App() {
  const sheetRef = useRef<ModalSheetRef>(null);

  return (
    <View style={{ flex: 1 }}>
      <Button title="Open Sheet" onPress={() => sheetRef.current?.open()} />

      <ModalSheet ref={sheetRef} height={400}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center' }}>
          Hello Bottom Sheet! 👋
        </Text>
      </ModalSheet>
    </View>
  );
}
```

### With Snap Points

```tsx
import { useRef, useState } from 'react';

function MyComponent() {
  const sheetRef = useRef<ModalSheetRef>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <ModalSheet
      ref={sheetRef}
      snapPoints={[0.3, 0.6, 0.9]} // 30%, 60%, 90% of screen height
      initialSnapIndex={0}
      onSnapPointChange={(index) => setCurrentIndex(index)}
    >
      <Text>Current snap point: {currentIndex}</Text>
    </ModalSheet>
  );
}
```

### With Scroll-to-Expand (NEW in v2.0.0!)

```tsx
import { ScrollView } from 'react-native';

<ModalSheet
  ref={sheetRef}
  snapPoints={[0.3, 0.9]}
  enableScrollToExpand={true}
  scrollExpandThreshold={20}
>
  <ScrollView
    onScroll={(e) => sheetRef.current?.handleScroll(e)}
    onScrollBeginDrag={(e) => sheetRef.current?.handleScrollBeginDrag(e)}
    onScrollEndDrag={(e) => sheetRef.current?.handleScrollEndDrag(e)}
    scrollEventThrottle={16}
  >
    {/* Your scrollable content */}
  </ScrollView>
</ModalSheet>
```

### With Drag & Drop Support (NEW in v2.1.0!)

```tsx
import DraggableFlatList from 'react-native-draggable-flatlist';

<ModalSheet
  ref={sheetRef}
  height={500}
  enableDragAndDrop={true} // Automatically wraps in GestureHandlerRootView
>
  <DraggableFlatList
    data={items}
    renderItem={renderItem}
    keyExtractor={(item) => item.key}
    onDragEnd={({ data }) => setItems(data)}
  />
</ModalSheet>
```

## 📚 API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | **Required** | Content to be rendered inside the bottom sheet |
| `height` | `number` | `400` | Height of the bottom sheet in pixels |
| `snapPoints` | `number[]` | - | Array of snap points as percentages (0-1) or pixels |
| `initialSnapIndex` | `number` | `0` | Which snap point to open to initially |
| `enableScrollToExpand` | `boolean` | `true` | Enable scroll-to-expand behavior |
| `scrollExpandThreshold` | `number` | `50` | Pixels to scroll before triggering transition |
| `enableDragAndDrop` | `boolean` | `false` | Enable automatic GestureHandlerRootView wrapping for gesture components |
| `avoidKeyboard` | `boolean` | `false` | Enable keyboard avoidance to push sheet up when keyboard appears |
| `keyboardOffset` | `number` | `0` | Additional offset when keyboard is shown (in pixels) |
| `onSnapPointChange` | `(index: number) => void` | - | Callback when snap point changes |
| `onClose` | `() => void` | - | Callback when the sheet is closed |
| `onOpen` | `() => void` | - | Callback when the sheet is opened |
| `backgroundColor` | `string` | `'white'` | Background color of the sheet |
| `borderRadius` | `number` | `20` | Border radius of the top corners |
| `showHandle` | `boolean` | `true` | Show the drag handle indicator |
| `handleColor` | `string` | `'#DDD'` | Color of the drag handle |
| `backdropOpacity` | `number` | `0.5` | Opacity of the backdrop (0-1) |
| `dragThreshold` | `number` | `125` | Distance to drag before sheet closes |
| `applyBottomInset` | `boolean` | `true` | Apply bottom safe area inset padding to content |
| `aria-label` | `string` | `'Bottom sheet'` | Accessible label for the modal |
| `aria-describedby` | `string` | - | ID of element describing the modal |
| `backdropAriaLabel` | `string` | `'Close bottom sheet'` | Accessible label for backdrop |

### Methods (via ref)

| Method | Description |
|--------|-------------|
| `open()` | Opens the bottom sheet |
| `close()` | Closes the bottom sheet |
| `present()` | Alias for `open()` |
| `dismiss()` | Alias for `close()` |
| `snapToPoint(index)` | Snap to a specific snap point by index |
| `handleScroll(event)` | Process scroll events for scroll-to-expand |
| `handleScrollBeginDrag(event)` | Track scroll start position |
| `handleScrollEndDrag(event)` | Handle pull-to-collapse gestures |

## 🎨 Examples

### Custom Styling

```tsx
<ModalSheet
  ref={sheetRef}
  height={500}
  backgroundColor="#1a1a1a"
  borderRadius={30}
  handleColor="#666"
  backdropOpacity={0.8}
>
  <Text style={{ color: 'white' }}>Dark Theme Sheet</Text>
</ModalSheet>
```

### Music Player (Two Snap Points)

```tsx
<ModalSheet
  ref={sheetRef}
  snapPoints={[0.15, 0.9]} // Mini player and full player
  initialSnapIndex={0}
  enableScrollToExpand={true}
>
  {/* Your music player UI */}
</ModalSheet>
```

### Scrollable Content

```tsx
<ModalSheet ref={sheetRef} height={600}>
  <ScrollView showsVerticalScrollIndicator={false}>
    {items.map((item) => (
      <Text key={item.id}>{item.name}</Text>
    ))}
  </ScrollView>
</ModalSheet>
```

### With Safe Area Insets

```tsx
// The bottom safe area inset is applied by default
<ModalSheet ref={sheetRef} height={400}>
  <View>
    <Text>Content with safe area padding</Text>
    {/* Bottom padding automatically applied for devices with home indicator */}
  </View>
</ModalSheet>

// Disable bottom inset if not needed
<ModalSheet ref={sheetRef} height={400} applyBottomInset={false}>
  <View>
    <Text>Content without safe area padding</Text>
  </View>
</ModalSheet>
```

## 🎯 Scroll-to-Expand Behavior

The scroll-to-expand feature allows users to naturally expand the sheet by scrolling down:

- **Gentle scroll down**: Expands to next snap point
- **Medium swipe down**: Jumps 2 snap points
- **Fast swipe down**: Jumps to maximum height

And collapse by pulling up at the top:

- **Gentle pull up**: Collapses to previous snap point
- **Fast swipe up**: Closes the sheet immediately

## ♿ Accessibility

Fully accessible with WCAG compliance:

- ✅ **ARIA Attributes** - Modern `aria-label`, `aria-modal`, `aria-describedby`
- ✅ **Screen Reader Support** - Proper labeling for all interactive elements
- ✅ **Keyboard Navigation** - Full keyboard support
- ✅ **Focus Management** - Correct focus handling
- ✅ **Gesture Alternatives** - Alternative methods for all gestures

## 🚀 Performance

- **Transform-Based**: Uses `translateY` transforms for 60fps animations
- **Native Driver**: All animations run on the UI thread
- **Smooth Easing**: Custom bezier curve (0.25, 0.1, 0.25, 1)
- **No Layout Recalculations**: Content pre-rendered once
- **Optimized**: Efficient re-renders and memory management

## 📱 Platform Support

- ✅ iOS
- ✅ Android
- ✅ Expo
- ✅ React Native CLI

## 🔗 Links

- [GitHub Repository](https://github.com/christi10/ModalSheet)
- [Changelog](https://github.com/christi10/ModalSheet/blob/main/CHANGELOG.md)
- [Issues](https://github.com/christi10/ModalSheet/issues)

## 📄 License

MIT © Christian

## ☕ Support

If you find this project helpful, consider supporting:

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-☕-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/kareemtab)

---

**Made with ❤️ using React Native**
