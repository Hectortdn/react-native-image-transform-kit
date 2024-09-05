import React from 'react';
import {
  runOnJS,
  useSharedValue,
  cancelAnimation,
} from 'react-native-reanimated';

import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';

import { clamp, pinchTransform } from '../utils/functions';
import { useTransformImage } from './transform-image';

interface GestureImageViewProps {
  children: React.ReactNode;
}

export function GestureImageView({ children }: GestureImageViewProps) {
  const {
    showGrid,
    postScale,
    baseImage,
    imageScale,
    postTranslate,
    imageTranslate,
    imageAngleDree,
    retrieveCurrentCropMetadata,
    retrieveCurrentImageMetadata,
    setImageToWrapCropBounds,
  } = useTransformImage();

  const lastScale = useSharedValue(1);
  const lastTranslate = useSharedValue({ x: 0, y: 0 });
  const origin = { x: useSharedValue(0), y: useSharedValue(0) };
  const offset = { x: useSharedValue(0), y: useSharedValue(0) };

  const onGestureEnded = () => {
    setImageToWrapCropBounds(true);
  };

  const panGesture = Gesture.Pan()
    .averageTouches(true)
    .maxPointers(1)
    .enableTrackpadTwoFingerGesture(true)
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
      runOnJS(onGestureEnded)();
    });

  const boundFn: any = () => {
    'worklet';
    const crop = retrieveCurrentCropMetadata();
    const image = retrieveCurrentImageMetadata();

    let size = { width: image.width, height: image.height };

    const isInInverseAspectRatio = imageAngleDree.value % Math.PI !== 0;
    if (isInInverseAspectRatio) {
      size = { width: size.height, height: size.width };
    }

    const boundX = size.width - crop.width / 2;
    const boundY = size.height - crop.height / 2;

    return { x: boundX, y: boundY };
  };

  const pinchGesture = Gesture.Pinch()
    .onStart((e) => {
      cancelAnimation(imageScale);
      cancelAnimation(imageTranslate);

      lastScale.value = imageScale.value;
      origin.x.value = e.focalX - baseImage.value.center.x;
      origin.y.value = e.focalY - baseImage.value.center.y;

      offset.x.value = imageTranslate.value.x;
      offset.y.value = imageTranslate.value.y;
    })
    .onUpdate((e) => {
      showGrid.value = true;
      const newScale = clamp(1, lastScale.value * e.scale, 10);

      const { x, y } = pinchTransform({
        toScale: newScale,
        fromScale: lastScale.value,
        origin: { x: origin.x.value, y: origin.y.value },
        offset: { x: offset.x.value, y: offset.y.value },
      });

      const { x: boundX, y: boundY } = boundFn(newScale);

      postScale(newScale);

      postTranslate({
        x: clamp(x, -boundX, boundX),
        y: clamp(y, -boundY, boundY),
      });
    })
    .onEnd(() => {
      showGrid.value = false;

      setImageToWrapCropBounds(true);
      runOnJS(onGestureEnded)();
    });

  const gesture = Gesture.Simultaneous(pinchGesture, panGesture);

  return (
    <GestureHandlerRootView>
      <GestureDetector gesture={gesture}>{children}</GestureDetector>
    </GestureHandlerRootView>
  );
}
