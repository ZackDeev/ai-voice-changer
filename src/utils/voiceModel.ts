import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
import { bundleResourceIO } from '@tensorflow/tfjs-react-native';
import { APP_CONFIG } from '../../config/appConfig';

let model: tf.LayersModel | null = null;

export async function initializeModel() {
  try {
    // Initialize TensorFlow.js
    await tf.ready();
    
    // Register the required backend
    await tf.setBackend('rn-webgl');
    
    // Load the model files
    const modelJson = require('../../assets/model/model.json');
    const modelWeights = require('../../assets/model/weights.bin');
    
    // Load the model using bundleResourceIO
    model = await tf.loadLayersModel(bundleResourceIO(modelJson, modelWeights));
    
    // Warm up the model
    const dummyInput = tf.zeros(APP_CONFIG.model.inputSize);
    await model.predict(dummyInput);
    tf.dispose(dummyInput);
    
    return true;
  } catch (error) {
    console.error('Error initializing model:', error);
    return false;
  }
}

export async function convertVoice(
  inputBuffer: Float32Array,
  voiceId: string,
  settings: {
    pitch: number;
    speed: number;
    emotion: string;
    language: string;
  }
): Promise<Float32Array> {
  if (!model) {
    throw new Error('Model not initialized');
  }

  try {
    // Preprocess the audio data
    const inputTensor = preprocessAudio(inputBuffer);
    
    // Get voice embedding for the target voice
    const voiceEmbedding = getVoiceEmbedding(voiceId);
    
    // Combine input audio with voice embedding and settings
    const modelInput = combineInputs(inputTensor, voiceEmbedding, settings);
    
    // Run inference
    const outputTensor = (model!.predict(modelInput) as tf.Tensor);
    
    // Post-process the output
    const outputBuffer = await postprocessAudio(outputTensor);
    
    // Cleanup
    tf.dispose([inputTensor, modelInput, outputTensor]);
    
    return outputBuffer;
  } catch (error) {
    console.error('Error converting voice:', error);
    throw error;
  }
}

function preprocessAudio(buffer: Float32Array): tf.Tensor {
  // Convert audio buffer to tensor
  const tensor = tf.tensor1d(buffer);
  
  // Reshape to match model input size
  const [batchSize, timeSteps] = APP_CONFIG.model.inputSize;
  const reshaped = tensor.reshape([1, -1]);
  
  // Pad or trim to match required length
  const padded = tf.pad(reshaped, [[0, 0], [0, Math.max(0, timeSteps - (reshaped.shape as number[])[1])]]);
  const trimmed = padded.slice([0, 0], [1, timeSteps]);
  
  // Normalize
  const normalized = trimmed.div(tf.scalar(32768.0));
  
  // Cleanup intermediate tensors
  tf.dispose([tensor, reshaped, padded]);
  
  return normalized;
}

function getVoiceEmbedding(voiceId: string): tf.Tensor {
  // Note: In a real implementation, you would:
  // 1. Load pre-computed voice embeddings from a file
  // 2. Or compute them on-the-fly using a speaker encoder model
  
  // For now, return a dummy embedding
  const embeddingSize = 256;
  return tf.randomNormal([1, embeddingSize]);
}

function combineInputs(
  audio: tf.Tensor,
  voiceEmbedding: tf.Tensor,
  settings: {
    pitch: number;
    speed: number;
    emotion: string;
    language: string;
  }
): tf.Tensor {
  // Convert settings to tensors
  const pitchTensor = tf.scalar(settings.pitch);
  const speedTensor = tf.scalar(settings.speed);
  
  // One-hot encode categorical settings
  const emotionTensor = tf.oneHot(
    tf.scalar(APP_CONFIG.voiceProcessing.supportedEmotions.indexOf(settings.emotion)),
    APP_CONFIG.voiceProcessing.supportedEmotions.length
  );
  const languageTensor = tf.oneHot(
    tf.scalar(APP_CONFIG.voiceProcessing.supportedLanguages.indexOf(settings.language)),
    APP_CONFIG.voiceProcessing.supportedLanguages.length
  );
  
  // Combine all inputs
  // Note: The exact combination method would depend on your model architecture
  const combined = tf.concat([
    audio,
    voiceEmbedding.reshape([1, -1]),
    pitchTensor.reshape([1, 1]),
    speedTensor.reshape([1, 1]),
    emotionTensor.reshape([1, -1]),
    languageTensor.reshape([1, -1]),
  ], 1);
  
  // Cleanup intermediate tensors
  tf.dispose([pitchTensor, speedTensor, emotionTensor, languageTensor]);
  
  return combined;
}

async function postprocessAudio(tensor: tf.Tensor): Promise<Float32Array> {
  // Denormalize
  const denormalized = tensor.mul(tf.scalar(32768.0));
  
  // Convert to audio buffer
  const buffer = await denormalized.data() as Float32Array;
  
  // Cleanup
  tf.dispose(denormalized);
  
  return buffer;
} 