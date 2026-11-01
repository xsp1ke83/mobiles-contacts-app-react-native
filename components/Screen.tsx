import React from 'react';
import { ScrollView, StyleSheet, View, type ScrollViewProps, type ViewStyle } from 'react-native';
import { useAppColors } from '@/context/AppContext';
import { darkColors, lightColors } from '@/constants/theme';

export function Screen({ children, contentContainerStyle, ...props }: ScrollViewProps) {
  const { isDark } = useAppColors();
  const colors = isDark ? darkColors : lightColors;
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={[styles.content, contentContainerStyle]}
      keyboardShouldPersistTaps="handled"
      {...props}
    >
      {children}
    </ScrollView>
  );
}

export function Surface({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  const { isDark } = useAppColors();
  const colors = isDark ? darkColors : lightColors;
  return <View style={[styles.surface, { backgroundColor: colors.surface, borderColor: colors.border }, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 36, flexGrow: 1 },
  surface: { borderRadius: 20, borderWidth: 1, padding: 16 },
});
