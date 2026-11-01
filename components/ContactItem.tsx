import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import type { Contact } from '@/types/contact';
import { ContactAvatar } from '@/components/ContactAvatar';
import { useAppColors } from '@/context/AppContext';
import { darkColors, lightColors } from '@/constants/theme';

export function ContactItem({ contact }: { contact: Contact }) {
  const router = useRouter();
  const { isDark } = useAppColors();
  const colors = isDark ? darkColors : lightColors;
  return (
    <Pressable onPress={() => router.push(`/contact/${contact.id}`)} style={({ pressed }) => [styles.row, { opacity: pressed ? 0.72 : 1 }]}>
      <ContactAvatar firstName={contact.firstName} lastName={contact.lastName} />
      <View style={styles.info}>
        <Text style={[styles.name, { color: colors.text }]}>{contact.firstName} {contact.lastName}</Text>
        <Text style={[styles.phone, { color: colors.muted }]}>{contact.mobilePhone}</Text>
      </View>
      <Ionicons name="chevron-forward" size={19} color={colors.muted} />
    </Pressable>
  );
}
const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, gap: 14 },
  info: { flex: 1, gap: 4 },
  name: { fontSize: 16, fontWeight: '600' },
  phone: { fontSize: 13 },
});
