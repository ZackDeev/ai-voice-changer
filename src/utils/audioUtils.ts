import { Audio } from 'expo-av';

export interface AudioMetadata {
  duration: number;
  sampleRate: number;
  channels: number;
  bitDepth: number;
}

export async function getAudioMetadata(audioUri: string): Promise<AudioMetadata> {
  try {
    const { sound } = await Audio.Sound.createAsync(
      { uri: audioUri },
      { shouldPlay: false }
    );
    
    const status = await sound.getStatusAsync();
    await sound.unloadAsync();
    
    return {
      duration: status.durationMillis ? status.durationMillis / 1000 : 0,
      sampleRate: status.sampleRate || 44100,
      channels: status.numberOfChannels || 2,
      bitDepth: 16, // Default to 16-bit audio
    };
  } catch (error) {
    console.error('Error getting audio metadata:', error);
    throw error;
  }
}

export function normalizeAudioData(audioData: Float32Array): Float32Array {
  // Find the maximum absolute value
  let maxValue = 0;
  for (let i = 0; i < audioData.length; i++) {
    maxValue = Math.max(maxValue, Math.abs(audioData[i]));
  }

  // Normalize the audio data
  if (maxValue > 0) {
    for (let i = 0; i < audioData.length; i++) {
      audioData[i] = audioData[i] / maxValue;
    }
  }

  return audioData;
}

export function applyPitchShift(
  audioData: Float32Array,
  pitchFactor: number
): Float32Array {
  // Simple pitch shifting using resampling
  const newLength = Math.floor(audioData.length / pitchFactor);
  const result = new Float32Array(newLength);

  for (let i = 0; i < newLength; i++) {
    const originalIndex = Math.floor(i * pitchFactor);
    result[i] = audioData[originalIndex];
  }

  return result;
}

export function applySpeedChange(
  audioData: Float32Array,
  speedFactor: number
): Float32Array {
  // Speed change using linear interpolation
  const newLength = Math.floor(audioData.length / speedFactor);
  const result = new Float32Array(newLength);

  for (let i = 0; i < newLength; i++) {
    const originalIndex = i * speedFactor;
    const index1 = Math.floor(originalIndex);
    const index2 = Math.min(index1 + 1, audioData.length - 1);
    const fraction = originalIndex - index1;
    
    result[i] = audioData[index1] * (1 - fraction) + audioData[index2] * fraction;
  }

  return result;
}

export function applyEmotionEffect(
  audioData: Float32Array,
  emotion: string
): Float32Array {
  // Apply different audio effects based on emotion
  switch (emotion.toLowerCase()) {
    case 'excited':
      return applyPitchShift(audioData, 1.2);
    case 'sad':
      return applyPitchShift(audioData, 0.8);
    case 'angry':
      return applySpeedChange(audioData, 1.2);
    case 'calm':
      return applySpeedChange(audioData, 0.8);
    default:
      return audioData;
  }
}

export function convertToWav(
  audioData: Float32Array,
  sampleRate: number,
  channels: number
): ArrayBuffer {
  // Convert Float32Array to WAV format
  const buffer = new ArrayBuffer(44 + audioData.length * 2);
  const view = new DataView(buffer);

  // Write WAV header
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + audioData.length * 2, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, channels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * channels * 2, true);
  view.setUint16(32, channels * 2, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, 'data');
  view.setUint32(40, audioData.length * 2, true);

  // Write audio data
  let offset = 44;
  for (let i = 0; i < audioData.length; i++) {
    const sample = Math.max(-1, Math.min(1, audioData[i]));
    view.setInt16(offset, sample * 0x7FFF, true);
    offset += 2;
  }

  return buffer;
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
} 