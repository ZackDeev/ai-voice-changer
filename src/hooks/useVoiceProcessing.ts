import { useState, useCallback } from 'react';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { APP_CONFIG } from '../../config/appConfig';
import { VoiceProcessingOptions } from '../types/voice';
import {
  loadAudioBuffer,
  processAudio,
  saveProcessedAudio,
} from '../utils/audioProcessing';

interface VoiceProcessingState {
  isRecording: boolean;
  isProcessing: boolean;
  selectedVoice: string | null;
  recordingUri: string | null;
  processedUri: string | null;
  error: string | null;
  settings: VoiceProcessingOptions;
}

export function useVoiceProcessing() {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [state, setState] = useState<VoiceProcessingState>({
    isRecording: false,
    isProcessing: false,
    selectedVoice: null,
    recordingUri: null,
    processedUri: null,
    error: null,
    settings: {
      ...APP_CONFIG.model.defaultSettings,
      selectedVoice: '',
    },
  });

  const startRecording = useCallback(async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setState(prev => ({ ...prev, isRecording: true, error: null }));
      await recording.startAsync();
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: 'Failed to start recording',
      }));
    }
  }, []);

  const stopRecording = useCallback(async () => {
    if (!recording || !state.selectedVoice) return;

    try {
      setState(prev => ({ ...prev, isRecording: false }));
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      if (!uri) throw new Error('No recording URI available');

      setState(prev => ({
        ...prev,
        recordingUri: uri,
        isProcessing: true,
      }));

      // Process the audio
      const audioBuffer = await loadAudioBuffer(uri);
      const processedBuffer = await processAudio(
        audioBuffer,
        state.selectedVoice,
        state.settings
      );

      // Save the processed audio
      const processedUri = await saveProcessedAudio(
        processedBuffer,
        `processed_${Date.now()}.wav`
      );

      setState(prev => ({
        ...prev,
        isProcessing: false,
        processedUri,
      }));

      setRecording(null);
    } catch (err) {
      setState(prev => ({
        ...prev,
        isProcessing: false,
        error: 'Failed to process recording',
      }));
      setRecording(null);
    }
  }, [recording, state.selectedVoice, state.settings]);

  const updateVoiceSettings = useCallback((settings: Partial<VoiceProcessingOptions>) => {
    setState(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        ...settings,
      },
      selectedVoice: settings.selectedVoice || prev.selectedVoice,
    }));
  }, []);

  const clearRecording = useCallback(() => {
    setState(prev => ({
      ...prev,
      recordingUri: null,
      processedUri: null,
      error: null,
    }));
  }, []);

  return {
    ...state,
    startRecording,
    stopRecording,
    updateVoiceSettings,
    clearRecording,
  };
} 