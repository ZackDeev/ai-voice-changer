import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { APP_CONFIG } from '../config/appConfig';

export default function Layout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: APP_CONFIG.ui.theme.surface,
          },
          headerTintColor: APP_CONFIG.ui.theme.text,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: 'AI Voice Changer',
            headerShown: false,
          }}
        />
      </Stack>
    </>
  );
}
