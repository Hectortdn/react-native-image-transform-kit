import React from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useAnimatedReaction,
} from 'react-native-reanimated';

import type { TransformImageViewProps } from './types';
import { useTransformImage } from './transform-image';
import { resizeImage } from '../utils/functions';

export function TransformImageView({
  style,
  width,
  height,
  imageUri,
}: TransformImageViewProps) {
  const {
    baseImage,
    imageScale,
    imageAngleDree,
    imageTranslate,
    setImageToWrapCropBounds,
  } = useTransformImage();
  const refLayoutImage = React.useRef<Animated.Image>(null);

  const onLayout = () => {
    refLayoutImage.current?.measure((_x, _y, width, height, pageX, pageY) => {
      const center = { x: pageX + width / 2, y: pageY + height / 2 };
      baseImage.value = {
        ...resizeImage({ height, width }),
        center,
        coord: { x: pageX, y: pageY },
      };
    });
  };

  const animatedStyle = useAnimatedStyle(() => {
    const resizedImage = resizeImage({ height, width });
    return {
      ...resizedImage,
      transform: [
        { translateX: imageTranslate.value.x },
        { translateY: imageTranslate.value.y },
        { rotate: `${imageAngleDree.value}deg` },
        { scale: imageScale.value },
      ],
    };
  }, [imageTranslate, imageAngleDree, imageScale]);

  useAnimatedReaction(
    () => baseImage.value,
    (value, prev) => {
      if (value.height && value.width && value !== prev) {
        setImageToWrapCropBounds(false);
      }
    },
    []
  );

  return (
    <Animated.Image
      onLayout={onLayout}
      ref={refLayoutImage}
      source={{ uri: imageUri }}
      style={[style, st.image, animatedStyle]}
    />
  );
}

const st = StyleSheet.create({
  image: {
    position: 'absolute',
    resizeMode: 'stretch',
  },
});
