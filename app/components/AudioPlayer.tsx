import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Audio } from 'expo-av';
import { MaterialIcons } from '@expo/vector-icons';
import { APP_CONFIG } from '../../config/appConfig';
import CustomSlider from './CustomSlider';

interface AudioPlayerProps {
  audioUri: string;
  onPlaybackComplete?: () => void;
  style?: any;
}

export default function AudioPlayer({ audioUri, onPlaybackComplete, style }: AudioPlayerProps) {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const loadAudio = async () => {
    try {
      setIsLoading(true);
      if (sound) {
        await sound.unloadAsync();
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUri },
        { shouldPlay: false },
        onPlaybackStatusUpdate
      );

      setSound(newSound);
      const status = await newSound.getStatusAsync();
      setDuration(status.durationMillis ? status.durationMillis / 1000 : 0);
    } catch (error) {
      console.error('Error loading audio:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis / 1000);
      if (status.didJustFinish) {
        setIsPlaying(false);
        onPlaybackComplete?.();
      }
    }
  };

  const togglePlayback = async () => {
    if (!sound) {
      await loadAudio();
    }

    try {
      if (isPlaying) {
        await sound?.pauseAsync();
      } else {
        await sound?.playAsync();
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error('Error toggling playback:', error);
    }
  };

  const seekTo = async (value: number) => {
    if (sound) {
      try {
        await sound.setPositionAsync(value * 1000);
      } catch (error) {
        console.error('Error seeking:', error);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.playButton}
          onPress={togglePlayback}
          disabled={isLoading}
        >
          <MaterialIcons
            name={isPlaying ? 'pause' : 'play-arrow'}
            size={32}
            color={APP_CONFIG.ui.theme.primary}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.progressContainer}>
        <Text style={styles.timeText}>{formatTime(position)}</Text>
        <CustomSlider
          style={styles.progressBar}
          minimumValue={0}
          maximumValue={duration}
          value={position}
          onValueChange={seekTo}
          minimumTrackTintColor={APP_CONFIG.ui.theme.primary}
          maximumTrackTintColor={APP_CONFIG.ui.theme.textSecondary}
        />
        <Text style={styles.timeText}>{formatTime(duration)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: APP_CONFIG.ui.theme.surface,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: APP_CONFIG.ui.theme.background,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    marginHorizontal: 8,
  },
  timeText: {
    fontSize: 14,
    color: APP_CONFIG.ui.theme.textSecondary,
    minWidth: 45,
  },
}); 