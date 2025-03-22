# AI Voice Changer

A powerful AI-powered voice conversion application that can replicate celebrity voices with natural tone, emotional depth, and clear articulation.

## Features

- 🎙️ Voice Timbre: Maintain distinct vocal characteristics unique to each celebrity
- 😊 Emotional Range: Adapt to different emotions (excitement, anger, sadness, humor)
- 🎯 Pace and Rhythm: Mimic natural speech patterns, pauses, and emphasis
- 🎚️ Background Noise Reduction: Clear output even with minor input noise
- 🎛️ Adaptive Voice Control: Pitch adjustments, gender conversion, and age variation
- 🌍 Language Support: Multilingual capabilities
- ⚡ Real-Time Processing: Minimal latency for seamless voice conversion

## Supported Celebrity Voices

- Morgan Freeman (deep, iconic narration)
- Dwayne "The Rock" Johnson (strong, powerful voice)
- Scarlett Johansson (smooth and engaging tone)
- Kevin Hart (energetic and funny)
- Ariana Grande (light, melodic voice)
- Chris Hemsworth (powerful yet calm voice)
- Tom Hanks (warm and friendly)

## Technical Stack

- React Native / Expo
- TensorFlow.js for AI model inference
- WebRTC for real-time audio processing
- FFmpeg for audio format conversion
- Web Audio API for audio manipulation

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npx expo start
```

3. Run on your device:
- iOS: Scan QR code with Camera app
- Android: Scan QR code with Expo Go app

## Project Structure

```
ai-voice-changer/
├── app/                    # Main application code
│   ├── components/        # Reusable UI components
│   ├── screens/          # Screen components
│   ├── services/         # Business logic and API calls
│   └── utils/            # Helper functions
├── assets/               # Static assets
├── models/              # AI model files
└── config/              # Configuration files
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- TensorFlow.js team for the voice conversion models
- Expo team for the excellent mobile development framework
- All celebrity voice samples used for training
