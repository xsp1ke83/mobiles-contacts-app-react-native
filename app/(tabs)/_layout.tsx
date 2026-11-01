import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppColors } from '@/context/AppContext';
import { darkColors, lightColors } from '@/constants/theme';

export default function TabLayout() {
  const { isDark } = useAppColors();
  const c = isDark ? darkColors : lightColors;
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: c.primary,
      tabBarInactiveTintColor: c.muted,
      tabBarStyle: {
        backgroundColor: c.tab,
        borderTopColor: c.border,
        height: 86,
        paddingTop: 10,
        paddingBottom: 24,
      },
      tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
    }}>
      <Tabs.Screen name="index" options={{
        title: 'Contacts',
        tabBarIcon: ({ color, size }) => <Ionicons name="people-outline" size={size} color={color} />,
      }} />
      <Tabs.Screen name="settings" options={{
        title: 'Settings',
        tabBarIcon: ({ color, size }) => <Ionicons name="settings-outline" size={size} color={color} />,
      }} />
    </Tabs>
  );
}
