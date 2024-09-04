import React, { useCallback } from 'react';
import {
  View,
  Text,
  Animated,
  Vibration,
  TextInput,
  StyleSheet,
  Dimensions,
} from 'react-native';

import {
  type TextStyle,
  type ListRenderItem,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';

import { calculateCurrentValue } from '../../utils/functions';
import { Path, Svg } from 'react-native-svg';
import { RulerItem } from './ruler-item';

export type RulerPickerTextProps = Pick<
  TextStyle,
  'color' | 'fontSize' | 'fontWeight'
>;

const { width: windowWidth } = Dimensions.get('window');

export type Ruler = {
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  width?: number;
  height?: number;
  fractionDigits?: number;
  indicatorColor?: string;
  indicatorHeight?: number;
  initialStepColor?: string;
  initialStepWidth?: number;
  valueTextStyle?: RulerPickerTextProps;
  unitTextStyle?: RulerPickerTextProps;
  decelerationRate?: 'fast' | 'normal' | number;
  intervalType?: 'bidirectional' | 'unidirectional';

  onValueChange?: (value: number) => void;
  onValueChangeEnd?: (value: number) => void;
} & Partial<RulerItem>;

export type RulerPickerRef = {
  setValue: (value: number) => void;
};

export const Ruler = ({
  unit,
  min = 0,
  max = 10,
  step = 1,
  stepWidth = 1,
  fractionDigits = 0,
  longStepHeight = 18,
  gapBetweenSteps = 10,
  shortStepHeight = 12,
  initialStepWidth = 1.5,
  width = windowWidth * 0.9,
  indicatorColor = 'black',
  initialStepColor = 'black',
  shortStepColor = 'lightgray',
  longStepColor = 'darkgray',
  intervalType = 'unidirectional',
  onValueChange,
  unitTextStyle,
  valueTextStyle,
  onValueChangeEnd,
}: Ruler) => {
  const itemAmount = (max - min) / step;
  const itemSpace = stepWidth + gapBetweenSteps;

  const arrData = Array.from({ length: itemAmount + 1 }, (_, index) => index);

  const initialScrollIndex =
    intervalType === 'bidirectional' ? Math.abs(min) : 0;
  const initialValue = (arrData?.[initialScrollIndex] ?? 0).toFixed(
    fractionDigits
  );

  const stepTextRef = React.useRef<TextInput>(null);
  const prevValue = React.useRef<number>(Number(initialValue));
  const prevValueEnd = React.useRef<number>(Number(initialValue));

  const setValue = React.useCallback(
    (value: number, callback?: (value: number) => void) => {
      if (prevValue.current !== value) {
        callback?.(value);
        stepTextRef.current?.setNativeProps({
          text: value.toFixed(fractionDigits),
        });
      }

      prevValue.current = value;
    },
    [fractionDigits]
  );

  const setValueEnd = React.useCallback(
    (value: number, callback?: (value: number) => void) => {
      if (prevValueEnd.current !== value) {
        callback?.(value);
        stepTextRef.current?.setNativeProps({
          text: value.toFixed(fractionDigits),
        });
      }

      prevValueEnd.current = value;
    },
    [fractionDigits]
  );

  const onScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const newStep = calculateCurrentValue(
        event.nativeEvent.contentOffset.x,
        stepWidth,
        gapBetweenSteps,
        min,
        max,
        step
      );

      setValue(newStep, onValueChange);
    },
    [max, min, step, setValue, stepWidth, onValueChange, gapBetweenSteps]
  );

  const renderSeparator = useCallback(
    () => <View style={{ width: width * 0.5 - stepWidth * 0.5 }} />,
    [stepWidth, width]
  );

  const renderItem: ListRenderItem<number> = useCallback(
    ({ index }) => {
      const isInitialStep = initialScrollIndex === index;
      return (
        <RulerItem
          index={index}
          longStepHeight={longStepHeight}
          shortStepColor={shortStepColor}
          shortStepHeight={shortStepHeight}
          gapBetweenSteps={gapBetweenSteps}
          isLast={index === arrData.length - 1}
          stepWidth={isInitialStep ? initialStepWidth : stepWidth}
          longStepColor={isInitialStep ? initialStepColor : longStepColor}
        />
      );
    },
    [
      stepWidth,
      longStepColor,
      longStepHeight,
      arrData.length,
      shortStepColor,
      gapBetweenSteps,
      initialStepWidth,
      shortStepHeight,
      initialStepColor,
      initialScrollIndex,
    ]
  );

  const onMomentumScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const newStep = calculateCurrentValue(
        // scroll horizontal or vertical add logic
        //  event.nativeEvent.contentOffset.x || event.nativeEvent.contentOffset.y
        event.nativeEvent.contentOffset.x,
        stepWidth,
        gapBetweenSteps,
        min,
        max,
        step
      );

      setValueEnd(newStep, (value) => {
        onValueChangeEnd?.(value);
        Vibration.vibrate(30);
      });
    },
    [max, min, step, stepWidth, setValueEnd, gapBetweenSteps, onValueChangeEnd]
  );

  const valueTextAlign = unit ? 'right' : 'center';
  return (
    <View style={[st.container, { width: width }]}>
      <View style={st.displayTextContainer}>
        <TextInput
          ref={stepTextRef}
          defaultValue={initialValue}
          style={[
            {
              textAlign: valueTextAlign,
              lineHeight: valueTextStyle?.fontSize ?? st.valueText.fontSize,
            },
            st.valueText,
            valueTextStyle,
          ]}
        />
        {unit && (
          <Text
            style={[
              {
                lineHeight: unitTextStyle?.fontSize ?? st.unitText.fontSize,
              },
              st.unitText,
              unitTextStyle,
            ]}
          >
            {unit}
          </Text>
        )}
      </View>
      <Animated.FlatList
        horizontal
        data={arrData}
        onScroll={onScroll}
        nestedScrollEnabled
        decelerationRate={0.5}
        renderItem={renderItem}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderSeparator}
        ListFooterComponent={renderSeparator}
        showsHorizontalScrollIndicator={false}
        initialNumToRender={width / itemSpace}
        initialScrollIndex={initialScrollIndex}
        onMomentumScrollEnd={onMomentumScrollEnd}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={st.contentContainerStyle}
        snapToOffsets={arrData.map((_, index) => index * itemSpace)}
        getItemLayout={(_, index) => ({
          index,
          length: itemSpace,
          offset: itemSpace * index,
        })}
      />

      <View pointerEvents="none" style={[st.indicator]}>
        <Svg height={14} width={14} fill="none" viewBox=" 0 0 22 19">
          <Path
            fill={indicatorColor}
            d="m11.866 1 9.526 16.5a1 1 0 0 1-.866 1.5H1.474a1 1 0 0 1-.866-1.5L10.134 1a1 1 0 0 1 1.732 0"
          />
        </Svg>
      </View>
    </View>
  );
};

const st = StyleSheet.create({
  container: {
    alignSelf: 'center',
  },
  indicator: {
    width: '100%',
    alignItems: 'center',
  },
  displayTextContainer: {
    gap: 2,
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  valueText: {
    margin: 0,
    padding: 0,
    fontSize: 16,
    width: 'auto',
    color: 'black',
    fontWeight: '400',
  },
  unitText: {
    fontSize: 16,
    color: 'black',
    fontWeight: '400',
  },

  contentContainerStyle: { paddingBottom: 16, paddingTop: 12 },
});
