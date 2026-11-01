import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppProvider, useAppColors } from '@/context/AppContext';
import { darkColors, lightColors } from '@/constants/theme';

function RootNavigator() {
  const { isDark } = useAppColors();
  const c = isDark ? darkColors : lightColors;
  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack screenOptions={{
        headerStyle: { backgroundColor: c.background },
        headerTintColor: c.text,
        headerTitleStyle: { fontWeight: '700' },
        contentStyle: { backgroundColor: c.background },
        headerShadowVisible: false,
      }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="contact/add" options={{ title: 'New contact', presentation: 'modal' }} />
        <Stack.Screen name="contact/[id]" options={{ title: 'Contact details' }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return <AppProvider><RootNavigator /></AppProvider>;
}
