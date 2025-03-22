import { Voice } from '../src/types/voice';

export const APP_CONFIG = {
  // Audio recording settings
  audio: {
    sampleRate: 44100,
    channels: 2,
    bitDepth: 16,
    format: 'wav',
    maxDuration: 60, // seconds
    minDuration: 1, // seconds
  },

  // Voice processing settings
  voiceProcessing: {
    supportedEmotions: [
      'neutral',
      'happy',
      'sad',
      'angry',
      'excited',
      'calm',
      'fearful',
      'disgusted',
      'surprised',
    ],
    supportedLanguages: [
      'en',
      'es',
      'fr',
      'de',
      'it',
      'pt',
      'ru',
      'ja',
      'ko',
      'zh',
    ],
    maxRecordingDuration: 30, // seconds
    minRecordingDuration: 1, // seconds
    processingChunkSize: 16000, // samples (1 second at 16kHz)
  },

  // Model settings
  model: {
    path: 'assets/model',
    inputSize: [1, 16000] as [number, number], // 1 second of audio at 16kHz
    outputSize: [1, 16000],
    supportedVoices: [
      {
        id: 'morgan-freeman',
        name: 'Morgan Freeman',
        description: 'Deep, iconic narration voice',
        imageUrl: 'https://example.com/morgan-freeman.jpg',
      },
      {
        id: 'scarlett-johansson',
        name: 'Scarlett Johansson',
        description: 'Smooth and engaging tone',
        imageUrl: 'https://example.com/scarlett-johansson.jpg',
      },
      {
        id: 'david-attenborough',
        name: 'David Attenborough',
        description: 'Distinctive nature documentary voice',
        imageUrl: 'https://example.com/david-attenborough.jpg',
      },
      {
        id: 'james-earl-jones',
        name: 'James Earl Jones',
        description: 'Powerful and commanding voice',
        imageUrl: 'https://example.com/james-earl-jones.jpg',
      },
    ] as Voice[],
    defaultSettings: {
      pitch: 1.0,
      speed: 1.0,
      emotion: 'neutral',
      language: 'en',
    },
    audioConfig: {
      sampleRate: 44100,
      channels: 2,
      bitDepth: 16,
      format: 'wav',
    },
  },

  // UI settings
  ui: {
    theme: {
      primary: '#2196f3',
      accent: '#f44336',
      background: '#f5f5f5',
      surface: '#ffffff',
      text: '#333333',
      textSecondary: '#666666',
      border: '#e0e0e0',
      error: '#c62828',
    },
    animation: {
      duration: 300,
      easing: 'easeInOut',
    },
  },

  // Storage settings
  storage: {
    maxRecordings: 10,
    maxStorageSize: 500 * 1024 * 1024, // 500MB
    recordingPrefix: 'recording_',
    processedPrefix: 'processed_',
  },
}; 