import React from 'react';
import { View, StyleSheet, Animated, TouchableOpacity, ViewStyle, PanResponder, GestureResponderEvent } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { APP_CONFIG } from '../../config/appConfig';

interface CustomSliderProps {
  value: number;
  onValueChange: (value: number) => void;
  minimumValue: number;
  maximumValue: number;
  step?: number;
  style?: ViewStyle;
  color?: string;
}

export default function CustomSlider({
  value,
  onValueChange,
  minimumValue,
  maximumValue,
  step = 1,
  style,
  color = APP_CONFIG.ui.theme.primary,
}: CustomSliderProps) {
  const [sliderWidth, setSliderWidth] = React.useState(0);
  const pan = React.useRef(new Animated.Value(0)).current;
  const lastValue = React.useRef(value);

  React.useEffect(() => {
    lastValue.current = value;
  }, [value]);

  React.useEffect(() => {
    const range = maximumValue - minimumValue;
    const position = ((value - minimumValue) / range) * sliderWidth;
    pan.setValue(position);
  }, [value, minimumValue, maximumValue, sliderWidth]);

  const handlePanResponderGrant = () => {
    const currentValue = (pan as any)._value;
    pan.setOffset(currentValue);
    pan.setValue(0);
  };

  const handlePanResponderMove = (_: GestureResponderEvent, gestureState: { dx: number }) => {
    pan.setValue(gestureState.dx);
  };

  const handlePanResponderRelease = () => {
    pan.flattenOffset();
    const currentValue = (pan as any)._value;
    const currentOffset = (pan as any)._offset;
    const newPosition = currentValue + currentOffset;
    const range = maximumValue - minimumValue;
    const newValue = Math.round((newPosition / sliderWidth) * range * (1 / step)) * step;
    const clampedValue = Math.max(minimumValue, Math.min(maximumValue, newValue));
    onValueChange(clampedValue);
  };

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: handlePanResponderGrant,
      onPanResponderMove: handlePanResponderMove,
      onPanResponderRelease: handlePanResponderRelease,
      onPanResponderTerminate: handlePanResponderRelease,
      onPanResponderTerminationRequest: () => true,
    })
  ).current;

  const translateX = pan.interpolate({
    inputRange: [-sliderWidth, 0, sliderWidth],
    outputRange: [-sliderWidth, 0, sliderWidth],
    extrapolate: 'clamp',
  });

  const progress = pan.interpolate({
    inputRange: [0, sliderWidth],
    outputRange: [0, sliderWidth],
    extrapolate: 'clamp',
  });

  return (
    <View
      style={[styles.container, style]}
      onLayout={(event) => setSliderWidth(event.nativeEvent.layout.width)}
    >
      <View style={styles.track}>
        <Animated.View
          style={[
            styles.progress,
            {
              width: progress,
              backgroundColor: color,
            },
          ]}
        />
      </View>
      <Animated.View
        style={[
          styles.thumb,
          {
            transform: [{ translateX }],
            backgroundColor: color,
          },
        ]}
        {...panResponder.panHandlers}
      >
        <MaterialIcons name="drag-handle" size={24} color={APP_CONFIG.ui.theme.surface} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 40,
    justifyContent: 'center',
  },
  track: {
    height: 4,
    backgroundColor: APP_CONFIG.ui.theme.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    borderRadius: 2,
  },
  thumb: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: APP_CONFIG.ui.theme.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
}); 