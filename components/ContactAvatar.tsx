import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useAppColors } from '@/context/AppContext';
import { darkColors, lightColors } from '@/constants/theme';

const swatches = ['#E7EEFF', '#FCEBD9', '#E4F4EA', '#F5E7F4', '#E3F1F5', '#F8E5E5'];
export function ContactAvatar({ firstName, lastName, size = 52 }: { firstName: string; lastName: string; size?: number }) {
  const { isDark } = useAppColors();
  const colors = isDark ? darkColors : lightColors;
  const initials = `${firstName.trim().charAt(0)}${lastName.trim().charAt(0)}`.toUpperCase();
  const index = (firstName.charCodeAt(0) + lastName.charCodeAt(0)) % swatches.length;
  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2, backgroundColor: isDark ? colors.surfaceSecondary : swatches[index] }]}>
      <Text style={{ color: colors.primary, fontWeight: '700', fontSize: size * 0.31 }}>{initials || '?'}</Text>
    </View>
  );
}
const styles = StyleSheet.create({ avatar: { alignItems: 'center', justifyContent: 'center' } });
