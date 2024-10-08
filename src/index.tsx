import { StyleSheet, View } from 'react-native';

import type { TransformerHeaderProps } from './components/types';

import { TransformerHeader } from './components/transformer-header';
import { GestureImageView } from './components/gesture-image-view';
import { EditImage } from './components/edit-image/edit-image';
import { TranFormImage } from './components/transform-image';
import { CropImageView } from './components/crop-image-view';
import { colors } from './theme/theme';

interface CropViewProps extends TransformerHeaderProps {
  imageUri: string;
  imageWidth: number;
  imageHeight: number;
}

export function CropView({
  onCancel,
  imageUri,
  onConclude,
  imageWidth,
  imageHeight,
  onManipulate,
}: CropViewProps) {
  return (
    <View style={st.container}>
      <TranFormImage
        imageUri={imageUri}
        imageWidth={imageWidth}
        imageHeight={imageHeight}
      >
        <TransformerHeader
          onCancel={onCancel}
          onConclude={onConclude}
          onManipulate={onManipulate}
        />
        <GestureImageView>
          <CropImageView
            imageUri={imageUri}
            height={imageHeight}
            width={imageHeight}
          />
        </GestureImageView>
        <EditImage />
      </TranFormImage>
    </View>
  );
}

const st = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
});
