import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { type ViewStyle } from 'react-native';

import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { useTransformImage } from './transform-image';
import { colors } from '../theme/theme';

const isAndroid = Platform.OS === 'android';

const borderGridPlatform: ViewStyle = {
  borderStyle: isAndroid ? 'dashed' : 'solid',
};

export function GridView() {
  const { cropBounds, cropTranslate } = useTransformImage();
  const ref = React.useRef<Animated.View>(null);

  const animatedStyle = useAnimatedStyle(() => ({
    width: cropBounds.value.width,
    height: cropBounds.value.height,
  }));

  function onLayout() {
    ref.current?.measure((_x, _y, _width, _height, pageX, pageY) => {
      cropTranslate.value = { x: pageX, y: pageY };
    });
  }

  return (
    <View style={st.container}>
      <View style={st.opacity} />
      <View>
        <View style={st.opacity} />
        <Animated.View
          ref={ref}
          onLayout={onLayout}
          style={[st.gridContainer, borderGridPlatform, animatedStyle]}
        >
          <Animated.View
            style={[st.verticalGridView, borderGridPlatform, st.grid]}
          />

          <Animated.View
            style={[st.horizontalGridView, borderGridPlatform, st.grid]}
          />
        </Animated.View>
        <View style={st.opacity} />
      </View>
      <View style={st.opacity} />
    </View>
  );
}

const st = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
  },

  opacity: {
    flexGrow: 1,
    backgroundColor: colors.overlay,
  },

  gridContainer: {
    alignItems: 'center',
    borderColor: 'white',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },

  grid: {
    position: 'absolute',
    borderColor: 'white',
  },

  verticalGridView: {
    height: '100%',
    width: '33.33%',
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderRightWidth: StyleSheet.hairlineWidth,
  },

  horizontalGridView: {
    width: '100%',
    height: '33.33%',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
