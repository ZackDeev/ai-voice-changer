import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { APP_CONFIG } from '../../config/appConfig';
import { useVoiceProcessing } from '../../src/hooks/useVoiceProcessing';
import VoiceList from '../components/VoiceList';
import VoiceSettings from '../components/VoiceSettings';
import AudioWaveform from '../components/AudioWaveform';
import AudioPlayer from '../components/AudioPlayer';

export default function HomeScreen() {
  const {
    isRecording,
    isProcessing,
    selectedVoice,
    recordingUri,
    processedUri,
    error,
    startRecording,
    stopRecording,
    updateVoiceSettings,
    clearRecording,
  } = useVoiceProcessing();

  const [showSettings, setShowSettings] = useState(false);

  const handleVoiceSelect = (voiceId: string) => {
    if (!isRecording) {
      updateVoiceSettings({ selectedVoice: voiceId });
    } else {
      Alert.alert(
        'Cannot Change Voice',
        'Please stop recording before changing the voice.'
      );
    }
  };

  const handleRecordingPress = async () => {
    if (!selectedVoice) {
      Alert.alert('No Voice Selected', 'Please select a voice before recording.');
      return;
    }

    if (isRecording) {
      await stopRecording();
    } else {
      await startRecording();
    }
  };

  const handleSettingsPress = () => {
    if (!isRecording) {
      setShowSettings(!showSettings);
    } else {
      Alert.alert(
        'Cannot Change Settings',
        'Please stop recording before changing settings.'
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>AI Voice Changer</Text>
        <Text style={styles.subtitle}>Transform your voice into celebrity voices</Text>
      </View>

      <View style={styles.content}>
        <VoiceList
          voices={APP_CONFIG.model.supportedVoices}
          selectedVoice={selectedVoice}
          onVoiceSelect={handleVoiceSelect}
          style={styles.voiceList}
        />

        {showSettings && (
          <VoiceSettings
            settings={{
              selectedVoice: selectedVoice || '',
              pitch: 1.0,
              speed: 1.0,
              emotion: 'neutral',
              language: 'en',
            }}
            onSettingsChange={updateVoiceSettings}
            style={styles.settings}
          />
        )}

        {recordingUri && (
          <AudioWaveform
            audioUri={recordingUri}
            isRecording={isRecording}
            style={styles.waveform}
          />
        )}

        {processedUri && (
          <AudioPlayer
            audioUri={processedUri}
            style={styles.player}
          />
        )}
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={handleSettingsPress}
          disabled={isRecording}
        >
          <MaterialIcons
            name="settings"
            size={24}
            color={APP_CONFIG.ui.theme.text}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.recordButton,
            isRecording && styles.recordingButton,
          ]}
          onPress={handleRecordingPress}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator color="white" />
          ) : (
            <MaterialIcons
              name={isRecording ? 'stop' : 'mic'}
              size={32}
              color="white"
            />
          )}
        </TouchableOpacity>

        {(recordingUri || processedUri) && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={clearRecording}
            disabled={isRecording}
          >
            <MaterialIcons
              name="delete"
              size={24}
              color={APP_CONFIG.ui.theme.text}
            />
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APP_CONFIG.ui.theme.background,
  },
  header: {
    padding: 20,
    backgroundColor: APP_CONFIG.ui.theme.surface,
    borderBottomWidth: 1,
    borderBottomColor: APP_CONFIG.ui.theme.textSecondary,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: APP_CONFIG.ui.theme.text,
  },
  subtitle: {
    fontSize: 16,
    color: APP_CONFIG.ui.theme.textSecondary,
    marginTop: 5,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  voiceList: {
    marginBottom: 16,
  },
  settings: {
    marginBottom: 16,
  },
  waveform: {
    marginBottom: 16,
  },
  player: {
    marginBottom: 16,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: APP_CONFIG.ui.theme.surface,
    borderTopWidth: 1,
    borderTopColor: APP_CONFIG.ui.theme.textSecondary,
  },
  settingsButton: {
    position: 'absolute',
    left: 20,
    padding: 8,
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: APP_CONFIG.ui.theme.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  recordingButton: {
    backgroundColor: APP_CONFIG.ui.theme.accent,
  },
  clearButton: {
    position: 'absolute',
    right: 20,
    padding: 8,
  },
  errorContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  errorText: {
    color: '#c62828',
    textAlign: 'center',
  },
}); 