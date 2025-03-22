import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Audio } from 'expo-av';
import { APP_CONFIG } from '../../config/appConfig';

interface AudioWaveformProps {
  audioUri: string;
  isRecording: boolean;
  style?: any;
}

export default function AudioWaveform({ audioUri, isRecording, style }: AudioWaveformProps) {
  const bars = useRef<Animated.Value[]>([]);
  const animation = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    if (isRecording) {
      startAnimation();
    } else {
      stopAnimation();
    }
  }, [isRecording]);

  const startAnimation = () => {
    // Create 20 animated values for the bars
    bars.current = Array(20)
      .fill(0)
      .map(() => new Animated.Value(0));

    // Create random heights for each bar
    const animations = bars.current.map((bar, index) => {
      const randomHeight = Math.random() * 100;
      return Animated.sequence([
        Animated.timing(bar, {
          toValue: randomHeight,
          duration: 500,
          useNativeDriver: false,
        }),
        Animated.timing(bar, {
          toValue: 0,
          duration: 500,
          useNativeDriver: false,
        }),
      ]);
    });

    // Create a looped animation
    animation.current = Animated.loop(
      Animated.stagger(50, animations)
    );

    animation.current.start();
  };

  const stopAnimation = () => {
    if (animation.current) {
      animation.current.stop();
      animation.current = null;
    }
  };

  return (
    <View style={[styles.container, style]}>
      {bars.current.map((bar, index) => (
        <Animated.View
          key={index}
          style={[
            styles.bar,
            {
              height: bar,
              backgroundColor: APP_CONFIG.ui.theme.primary,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    paddingHorizontal: 16,
  },
  bar: {
    width: 3,
    marginHorizontal: 1,
    borderRadius: 2,
  },
}); 