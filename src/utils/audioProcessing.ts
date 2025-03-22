import * as tf from '@tensorflow/tfjs';
import { Audio, AVPlaybackStatus } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { APP_CONFIG } from '../../config/appConfig';
import { convertVoice, initializeModel } from './voiceModel';

let isModelInitialized = false;

export async function loadAudioBuffer(uri: string): Promise<Float32Array> {
  try {
    const { sound } = await Audio.Sound.createAsync(
      { uri },
      { shouldPlay: false }
    );
    
    const status = await sound.getStatusAsync();
    if (!status.isLoaded) {
      throw new Error('Failed to load audio');
    }
    
    const durationMs = status.durationMillis || 0;
    const numSamples = Math.floor(
      (durationMs / 1000) * APP_CONFIG.model.audioConfig.sampleRate
    );
    
    // Create a buffer to store the audio data
    const buffer = new Float32Array(numSamples);
    
    // Load audio data into buffer
    // Note: This is a placeholder. In a real implementation,
    // you would use platform-specific APIs to get raw audio data
    
    await sound.unloadAsync();
    return buffer;
  } catch (error) {
    console.error('Error loading audio buffer:', error);
    throw error;
  }
}

export async function processAudio(
  audioBuffer: Float32Array,
  voiceId: string,
  settings: {
    pitch: number;
    speed: number;
    emotion: string;
    language: string;
  }
): Promise<Float32Array> {
  try {
    // Initialize model if not already done
    if (!isModelInitialized) {
      const success = await initializeModel();
      if (!success) {
        throw new Error('Failed to initialize voice model');
      }
      isModelInitialized = true;
    }
    
    // Convert voice using the model
    const processedBuffer = await convertVoice(audioBuffer, voiceId, settings);
    
    return processedBuffer;
  } catch (error) {
    console.error('Error processing audio:', error);
    throw error;
  }
}

export async function saveProcessedAudio(
  buffer: Float32Array,
  filename: string
): Promise<string> {
  try {
    // Convert Float32Array to WAV format
    const wavBuffer = await float32ArrayToWav(buffer, {
      sampleRate: APP_CONFIG.model.audioConfig.sampleRate,
      numChannels: APP_CONFIG.model.audioConfig.channels,
    });
    
    const tempPath = `${FileSystem.cacheDirectory}/${filename}`;
    
    // Save the WAV file
    await FileSystem.writeAsStringAsync(
      tempPath,
      wavBuffer.toString('base64'),
      { encoding: FileSystem.EncodingType.Base64 }
    );
    
    return tempPath;
  } catch (error) {
    console.error('Error saving processed audio:', error);
    throw error;
  }
}

interface WavOptions {
  sampleRate: number;
  numChannels: number;
}

async function float32ArrayToWav(buffer: Float32Array, options: WavOptions): Promise<Buffer> {
  const { sampleRate, numChannels } = options;
  const bytesPerSample = 2; // 16-bit audio
  const format = 1; // PCM
  
  // Calculate sizes
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = buffer.length * bytesPerSample;
  const bufferSize = 44 + dataSize;
  
  // Create WAV buffer
  const wav = Buffer.alloc(bufferSize);
  
  // Write WAV header
  wav.write('RIFF', 0); // ChunkID
  wav.writeUInt32LE(36 + dataSize, 4); // ChunkSize
  wav.write('WAVE', 8); // Format
  wav.write('fmt ', 12); // Subchunk1ID
  wav.writeUInt32LE(16, 16); // Subchunk1Size
  wav.writeUInt16LE(format, 20); // AudioFormat
  wav.writeUInt16LE(numChannels, 22); // NumChannels
  wav.writeUInt32LE(sampleRate, 24); // SampleRate
  wav.writeUInt32LE(byteRate, 28); // ByteRate
  wav.writeUInt16LE(blockAlign, 32); // BlockAlign
  wav.writeUInt16LE(bytesPerSample * 8, 34); // BitsPerSample
  wav.write('data', 36); // Subchunk2ID
  wav.writeUInt32LE(dataSize, 40); // Subchunk2Size
  
  // Write audio data
  let offset = 44;
  for (let i = 0; i < buffer.length; i++) {
    wav.writeInt16LE(Math.max(-32768, Math.min(32767, buffer[i] * 32768)), offset);
    offset += 2;
  }
  
  return wav;
} 