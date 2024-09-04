import { View, StyleSheet, Dimensions } from 'react-native';

import { useTransformImage } from '../transform-image';
import { Proportions } from './proportions';
import { colors } from '../../theme/theme';
import { Ruler } from '../ruler/ruler';

const screen = Dimensions.get('window');

export function EditImage() {
  const { setCropBoundsAspectRatio, postRotate, setImageToWrapCropBounds } =
    useTransformImage();

  return (
    <View style={st.container}>
      <Proportions onChangeProportion={setCropBoundsAspectRatio} />

      <Ruler
        unit="°"
        max={90}
        min={-90}
        onValueChange={postRotate}
        intervalType="bidirectional"
        shortStepColor={colors.gray}
        longStepColor={colors.lightGray}
        indicatorColor={colors.primary}
        initialStepColor={colors.primary}
        unitTextStyle={{ color: colors.gray }}
        valueTextStyle={{ color: colors.gray }}
        onValueChangeEnd={() => setImageToWrapCropBounds(true)}
      />
    </View>
  );
}

const st = StyleSheet.create({
  container: {
    gap: 12,
    marginTop: 16,
    height: '100%',
    paddingVertical: 6,
  },

  editForm: {
    width: screen.width,
  },
});
