import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Screen, Surface } from '@/components/Screen';
import { ContactItem } from '@/components/ContactItem';
import { EmptyState } from '@/components/EmptyState';
import { useApp, useAppColors } from '@/context/AppContext';
import { darkColors, lightColors } from '@/constants/theme';

export default function ContactsScreen() {
  const router = useRouter();
  const { contacts, loading } = useApp();
  const { isDark } = useAppColors();
  const c = isDark ? darkColors : lightColors;
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase();
    if (!q) return contacts;
    return contacts.filter(item =>
      `${item.firstName} ${item.lastName}`.toLocaleLowerCase().includes(q) ||
      item.mobilePhone.toLocaleLowerCase().includes(q)
    );
  }, [contacts, query]);

  return (
    <Screen>
      <View style={styles.header}>
        <View>
          <Text style={[styles.eyebrow, { color: c.muted }]}>YOUR PERSONAL ADDRESS BOOK</Text>
          <Text style={[styles.title, { color: c.text }]}>Contacts</Text>
        </View>
        <Pressable onPress={() => router.push('/contact/add')} style={[styles.addButton, { backgroundColor: c.primary }]}>
          <Ionicons name="add" size={26} color="#FFFFFF" />
        </Pressable>
      </View>

      <View style={[styles.search, { backgroundColor: c.input, borderColor: c.border }]}>
        <Ionicons name="search-outline" size={20} color={c.muted} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search name or phone"
          placeholderTextColor={c.muted}
          style={[styles.searchInput, { color: c.text }]}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
        {!!query && <Pressable onPress={() => setQuery('')}><Ionicons name="close-circle" size={19} color={c.muted} /></Pressable>}
      </View>

      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: c.text }]}>{query ? 'Search results' : 'All contacts'}</Text>
        <Text style={[styles.count, { color: c.muted }]}>{filtered.length} {filtered.length === 1 ? 'contact' : 'contacts'}</Text>
      </View>

      {loading ? (
        <View style={{ padding: 48 }}><ActivityIndicator color={c.primary} /></View>
      ) : filtered.length === 0 ? (
        <Surface style={{ padding: 0, borderWidth: 0 }}>
          <EmptyState searching={!!query} />
        </Surface>
      ) : (
        <Surface style={{ paddingHorizontal: 16, paddingVertical: 2 }}>
          {filtered.map((contact, index) => (
            <View key={contact.id}>
              <ContactItem contact={contact} />
              {index < filtered.length - 1 && <View style={[styles.separator, { backgroundColor: c.border }]} />}
            </View>
          ))}
        </Surface>
      )}
      <Text style={[styles.footer, { color: c.muted }]}>Contacts are stored securely on this device.</Text>
    </Screen>
  );
}
const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 26, marginTop: 8 },
  eyebrow: { fontSize: 10, letterSpacing: 1.2, fontWeight: '700', marginBottom: 7 },
  title: { fontSize: 32, fontWeight: '800', letterSpacing: -0.8 },
  addButton: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  search: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 15, paddingHorizontal: 14, height: 54, gap: 10, marginBottom: 28 },
  searchInput: { flex: 1, fontSize: 14 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontWeight: '700' },
  count: { fontSize: 12 },
  separator: { height: 1, marginLeft: 66 },
  footer: { fontSize: 11, textAlign: 'center', marginTop: 22 },
});
