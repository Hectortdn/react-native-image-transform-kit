import React from 'react';
import { ActivityIndicator, StyleSheet, View, Text } from 'react-native';

import { type TransformerHeaderProps } from './types';

import { useTransformImage } from './transform-image';
import { colors } from '../theme/theme';

export function TransformerHeader({
  onCancel,
  onConclude,
  onManipulate,
}: TransformerHeaderProps) {
  const { cropImage } = useTransformImage();
  const [isLoading, setIsLoading] = React.useState(false);

  const onCrop = async () => {
    try {
      setIsLoading(true);
      const manipulateInfo = cropImage();
      const resultManipulation = await onManipulate?.(manipulateInfo);

      if (resultManipulation) {
        onConclude(resultManipulation.uri);
      }
    } catch (error) {
      console.log('error in crop image', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={st.container}>
      <Text style={st.label} onPress={onCancel}>
        Cancelar
      </Text>

      <View style={st.concludeButtonContainer}>
        <Text style={st.label} onPress={onCrop} disabled={isLoading}>
          Concluído
        </Text>
        {isLoading && <ActivityIndicator size={'small'} color="white" />}
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.black,
  },
  container: {
    marginBottom: 16,
    paddingVertical: 24,
    flexDirection: 'row',
    paddingHorizontal: 16,
    backgroundColor: colors.white,
    justifyContent: 'space-between',
  },

  concludeButtonContainer: {
    gap: 12,
    flexDirection: 'row',
  },
});
