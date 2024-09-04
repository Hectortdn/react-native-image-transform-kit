import Animated from 'react-native-reanimated';

import { type TransformImageViewProps } from './image-view';

import { RECT_EDIT_HEIGHT, RECT_EDIT_WIDTH } from '../utils/constants';
import { TransformImageView } from './image-view';
import { colors } from '../theme/theme';
import { GridView } from './grid-view';
import { StyleSheet } from 'react-native';

interface CropImageViewProps extends TransformImageViewProps {}

export function CropImageView({ imageUri }: CropImageViewProps) {
  return (
    <Animated.View collapsable={false} style={st.container}>
      <TransformImageView imageUri={imageUri} />
      <GridView />
    </Animated.View>
  );
}

const st = StyleSheet.create({
  container: {
    overflow: 'hidden',
    alignSelf: 'center',
    alignItems: 'center',
    width: RECT_EDIT_WIDTH,
    height: RECT_EDIT_HEIGHT,
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
});
