import React from 'react';
import { StyleSheet, View } from 'react-native';

export type RulerItem = {
  stepWidth: number;
  longStepColor: string;
  shortStepColor: string;
  longStepHeight: number;
  shortStepHeight: number;
  gapBetweenSteps: number;
};

type Props = {
  index: number;
  isLast: boolean;
} & RulerItem;

export const RulerItem = React.memo(
  ({
    index,
    isLast,
    stepWidth,
    longStepColor,
    longStepHeight,
    shortStepColor,
    gapBetweenSteps,
    shortStepHeight,
  }: Props) => {
    const isLong = index % 5 === 0;
    const height = isLong ? longStepHeight : shortStepHeight;

    const marginRight = isLast ? 0 : gapBetweenSteps;

    return (
      <View style={[st.container, { width: stepWidth, marginRight }]}>
        <View
          style={[
            st.content,
            {
              height: height,
              backgroundColor: isLong ? longStepColor : shortStepColor,
            },
          ]}
        />
      </View>
    );
  }
);

const st = StyleSheet.create({
  container: { justifyContent: 'center' },
  content: {
    width: '100%',
  },
});
