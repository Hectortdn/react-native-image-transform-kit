import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';

import { Rectangle3x2Proportion } from '../../icons/rectangle-3x2-proportion';
import { Rectangle2x3Proportion } from '../../icons/rectangle-2x3-proportion';
import { OriginalProportion } from '../../icons/original-proportion';
import { SquareProportion } from '../../icons/square-proportion';
import { RECT_ASPECT_RADIO } from '../../utils/constants';
import { colors } from '../../theme/theme';

interface ProportionsProps {
  onChangeProportion?: (aspectRadio: number) => void;
}

const ProportionIcon = ({
  Icon,
  label,
  onPress,
  isSelected,
}: {
  label: string;
  isSelected: boolean;
  onPress: () => void;
  Icon: React.ElementType;
}) => {
  const color = isSelected ? colors.primary : colors.lightGray;
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.5}
      disabled={isSelected}
      style={st.proportionContainer}
    >
      <Icon color={color} />
      <Text style={[st.proportionTitle, { color }]}>{label}</Text>
    </TouchableOpacity>
  );
};

const proportions = [
  { icon: OriginalProportion, label: 'Original', value: RECT_ASPECT_RADIO },
  { icon: SquareProportion, label: 'Square', value: 1 / 1 },
  { icon: Rectangle3x2Proportion, label: '3:2', value: 3 / 2 },
  { icon: Rectangle2x3Proportion, label: '2:3', value: 2 / 3 },
];

export function Proportions({ onChangeProportion }: ProportionsProps) {
  const [indexSelected, setIndexSelected] = React.useState(0);

  const handleSelectProportion = (index: number, value: number) => {
    setIndexSelected(index);
    onChangeProportion?.(value);
  };

  return (
    <View style={st.proportionsContainer}>
      {proportions.map(({ icon, label, value }, index) => (
        <ProportionIcon
          key={label}
          Icon={icon}
          label={label}
          isSelected={indexSelected === index}
          onPress={() => handleSelectProportion(index, value)}
        />
      ))}
    </View>
  );
}

const st = StyleSheet.create({
  proportionsContainer: {
    gap: 24,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  proportionContainer: {
    gap: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },

  proportionTitle: {
    fontSize: 12,
    fontWeight: '500',
  },
});
