import React from 'react';
import { useSharedValue } from 'react-native-reanimated';

import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';

import { useTransformImage } from './transform-image';

interface GestureImageViewProps {
  children: React.ReactNode;
}

export function GestureImageView({ children }: GestureImageViewProps) {
  const {
    showGrid,
    postScale,
    imageScale,
    postTranslate,
    imageTranslate,
    setImageToWrapCropBounds,
  } = useTransformImage();

  const lastScale = useSharedValue(1);
  const lastTranslate = useSharedValue({ x: 0, y: 0 });

  const panGesture = Gesture.Pan()
    .onStart(() => {
      lastTranslate.value = imageTranslate.value;
    })
    .onUpdate((e) => {
      showGrid.value = true;

      const x = lastTranslate.value.x + e.translationX;
      const y = lastTranslate.value.y + e.translationY;

      postTranslate({ x, y });
    })
    .onEnd(() => {
      showGrid.value = false;
      setImageToWrapCropBounds(true);
      lastTranslate.value = imageTranslate.value;
    });

  const pinchGesture = Gesture.Pinch()
    .onStart(() => {
      lastScale.value = imageScale.value;
    })
    .onUpdate((e) => {
      showGrid.value = true;
      const newScale = lastScale.value * (1 + (e.scale - 1) * 0.4);

      postScale(Math.max(0, Math.min(newScale, 10)));
    })
    .onEnd(() => {
      showGrid.value = false;
      setImageToWrapCropBounds(true);
    });

  const gesture = Gesture.Simultaneous(panGesture, pinchGesture);

  return (
    <GestureHandlerRootView>
      <GestureDetector gesture={gesture}>{children}</GestureDetector>
    </GestureHandlerRootView>
  );
}
