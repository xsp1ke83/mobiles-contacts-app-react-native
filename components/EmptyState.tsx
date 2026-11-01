import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppColors } from '@/context/AppContext';
import { darkColors, lightColors } from '@/constants/theme';

export function EmptyState({ searching = false }: { searching?: boolean }) {
  const { isDark } = useAppColors();
  const c = isDark ? darkColors : lightColors;
  return (
    <View style={styles.wrap}>
      <View style={[styles.icon, { backgroundColor: c.primarySoft }]}>
        <Ionicons name={searching ? 'search-outline' : 'people-outline'} size={34} color={c.primary} />
      </View>
      <Text style={[styles.title, { color: c.text }]}>{searching ? 'No results found' : 'Your contacts live here'}</Text>
      <Text style={[styles.subtitle, { color: c.muted }]}>
        {searching ? 'Try another name or phone number.' : 'Add your first contact to get started.'}
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 64 },
  icon: { width: 76, height: 76, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 18 },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  subtitle: { fontSize: 14, textAlign: 'center', lineHeight: 21 },
});
