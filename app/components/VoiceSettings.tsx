import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ViewStyle,
} from 'react-native';
import { APP_CONFIG } from '../../config/appConfig';
import { VoiceProcessingOptions } from '../../src/types/voice';
import CustomSlider from './CustomSlider';

interface VoiceSettingsProps {
  settings: VoiceProcessingOptions;
  onSettingsChange: (settings: Partial<VoiceProcessingOptions>) => void;
  style?: ViewStyle;
}

export default function VoiceSettings({ settings, onSettingsChange }: VoiceSettingsProps) {
  const handlePitchChange = (value: number) => {
    onSettingsChange({ pitch: value });
  };

  const handleSpeedChange = (value: number) => {
    onSettingsChange({ speed: value });
  };

  const handleEmotionChange = (emotion: string) => {
    onSettingsChange({ emotion });
  };

  const handleLanguageChange = (language: string) => {
    onSettingsChange({ language });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Voice Settings</Text>
        
        <View style={styles.setting}>
          <Text style={styles.settingLabel}>Pitch</Text>
          <CustomSlider
            style={styles.slider}
            minimumValue={0.5}
            maximumValue={2.0}
            step={0.1}
            value={settings.pitch}
            onValueChange={handlePitchChange}
            minimumTrackTintColor={APP_CONFIG.ui.theme.primary}
            maximumTrackTintColor={APP_CONFIG.ui.theme.textSecondary}
          />
          <Text style={styles.valueText}>{settings.pitch.toFixed(1)}x</Text>
        </View>

        <View style={styles.setting}>
          <Text style={styles.settingLabel}>Speed</Text>
          <CustomSlider
            style={styles.slider}
            minimumValue={0.5}
            maximumValue={2.0}
            step={0.1}
            value={settings.speed}
            onValueChange={handleSpeedChange}
            minimumTrackTintColor={APP_CONFIG.ui.theme.primary}
            maximumTrackTintColor={APP_CONFIG.ui.theme.textSecondary}
          />
          <Text style={styles.valueText}>{settings.speed.toFixed(1)}x</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Emotion</Text>
        <View style={styles.optionsContainer}>
          {APP_CONFIG.voiceProcessing.supportedEmotions.map((emotion) => (
            <TouchableOpacity
              key={emotion}
              style={[
                styles.optionButton,
                settings.emotion === emotion && styles.selectedOption,
              ]}
              onPress={() => handleEmotionChange(emotion)}
            >
              <Text
                style={[
                  styles.optionText,
                  settings.emotion === emotion && styles.selectedOptionText,
                ]}
              >
                {emotion.charAt(0).toUpperCase() + emotion.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Language</Text>
        <View style={styles.optionsContainer}>
          {APP_CONFIG.voiceProcessing.supportedLanguages.map((language) => (
            <TouchableOpacity
              key={language}
              style={[
                styles.optionButton,
                settings.language === language && styles.selectedOption,
              ]}
              onPress={() => handleLanguageChange(language)}
            >
              <Text
                style={[
                  styles.optionText,
                  settings.language === language && styles.selectedOptionText,
                ]}
              >
                {language.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APP_CONFIG.ui.theme.background,
  },
  section: {
    padding: 16,
    backgroundColor: APP_CONFIG.ui.theme.surface,
    marginBottom: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: APP_CONFIG.ui.theme.text,
    marginBottom: 16,
  },
  setting: {
    marginBottom: 16,
  },
  settingLabel: {
    fontSize: 16,
    color: APP_CONFIG.ui.theme.text,
    marginBottom: 8,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  valueText: {
    fontSize: 14,
    color: APP_CONFIG.ui.theme.textSecondary,
    textAlign: 'right',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: APP_CONFIG.ui.theme.background,
    borderWidth: 1,
    borderColor: APP_CONFIG.ui.theme.textSecondary,
  },
  selectedOption: {
    backgroundColor: APP_CONFIG.ui.theme.primary,
    borderColor: APP_CONFIG.ui.theme.primary,
  },
  optionText: {
    fontSize: 14,
    color: APP_CONFIG.ui.theme.text,
  },
  selectedOptionText: {
    color: APP_CONFIG.ui.theme.surface,
  },
}); 