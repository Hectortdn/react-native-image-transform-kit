import { StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

import type { TransformImageViewProps } from './types';
import { useTransformImage } from './transform-image';

export function TransformImageView({
  style,
  imageUri,
}: TransformImageViewProps) {
  const { imageTranslate, imageScale, imageAngleDree, baseImage } =
    useTransformImage();

  const animatedStyle = useAnimatedStyle(() => {
    const { height, width } = baseImage.value;

    return {
      height,
      width,
      transform: [
        { translateX: imageTranslate.value.x },
        { translateY: imageTranslate.value.y },
        { rotate: `${imageAngleDree.value}deg` },
        { scale: imageScale.value },
      ],
    };
  }, [imageTranslate, baseImage, imageAngleDree, imageScale]);

  return (
    <Animated.Image
      resizeMode="stretch"
      source={{ uri: imageUri }}
      style={[style, st.image, animatedStyle]}
    />
  );
}

const st = StyleSheet.create({
  image: {
    aspectRatio: 1,
    position: 'absolute',
  },
});
