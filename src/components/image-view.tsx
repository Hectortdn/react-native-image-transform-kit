import Animated, { useAnimatedStyle } from 'react-native-reanimated';

import { type ImageProps, StyleSheet } from 'react-native';

import { useTransformImage } from './transform-image';

export interface TransformImageViewProps extends Omit<ImageProps, 'source'> {
  imageUri: string;
}
export interface TransformImageViewRefProps {
  getCurrentScale: () => number;
  getCurrentAngle: () => number;
  currentImageCorners: number[];
  currentImageCenter: number[];
  postTranslate: (deltaX: number, deltaY: number) => void;
  postScale: (deltaScale: number, px: number, py: number) => void;
  postRotate: (deltaAngle: number, px: number, py: number) => void;
}

export function TransformImageView({
  imageUri,
  style,
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
