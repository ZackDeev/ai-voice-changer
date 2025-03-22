import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ViewStyle,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { APP_CONFIG } from '../../config/appConfig';
import { Voice } from '../../src/types/voice';

interface VoiceListProps {
  voices: Voice[];
  selectedVoice: string | null;
  onVoiceSelect: (voiceId: string) => void;
  style?: any;
}

export default function VoiceList({
  voices,
  selectedVoice,
  onVoiceSelect,
  style,
}: VoiceListProps) {
  return (
    <ScrollView style={[styles.container, style]}>
      {voices.map((voice) => (
        <TouchableOpacity
          key={voice.id}
          style={[
            styles.voiceCard,
            selectedVoice === voice.id && styles.selectedVoiceCard,
          ]}
          onPress={() => onVoiceSelect(voice.id)}
        >
          <Image
            source={{ uri: voice.imageUrl }}
            style={styles.voiceImage}
            defaultSource={require('../../assets/images/react-logo.png')}
          />
          <View style={styles.voiceInfo}>
            <Text style={styles.voiceName}>{voice.name}</Text>
            <Text style={styles.voiceDescription}>{voice.description}</Text>
          </View>
          {selectedVoice === voice.id && (
            <MaterialIcons name="check-circle" size={24} color={APP_CONFIG.ui.theme.primary} />
          )}
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  voiceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: APP_CONFIG.ui.theme.surface,
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectedVoiceCard: {
    backgroundColor: APP_CONFIG.ui.theme.background,
    borderColor: APP_CONFIG.ui.theme.primary,
    borderWidth: 1,
  },
  voiceImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  voiceInfo: {
    flex: 1,
  },
  voiceName: {
    fontSize: 18,
    fontWeight: '600',
    color: APP_CONFIG.ui.theme.text,
  },
  voiceDescription: {
    fontSize: 14,
    color: APP_CONFIG.ui.theme.textSecondary,
    marginTop: 4,
  },
}); 