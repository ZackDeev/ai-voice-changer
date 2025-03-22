export interface VoiceProcessingOptions {
  selectedVoice: string;
  pitch: number;
  speed: number;
  emotion: string;
  language: string;
}

export interface Voice {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
} 