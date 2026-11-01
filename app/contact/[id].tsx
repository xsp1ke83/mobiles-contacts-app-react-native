import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen, Surface } from '@/components/Screen';
import { ContactAvatar } from '@/components/ContactAvatar';
import { ContactForm } from '@/components/ContactForm';
import { useApp, useAppColors } from '@/context/AppContext';
import { darkColors, lightColors } from '@/constants/theme';
import type { Contact } from '@/types/contact';

export default function ContactDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { contacts, editContact, removeContact } = useApp();
  const { isDark } = useAppColors();
  const c = isDark ? darkColors : lightColors;
  const [editing, setEditing] = useState(false);
  const contact = contacts.find(item => item.id === Number(id));

  if (!contact) {
    return <Screen><Text style={{ color: c.text }}>Contact not found.</Text></Screen>;
  }

  const confirmDelete = () => Alert.alert(
    'Delete contact?',
    `${contact.firstName} ${contact.lastName} will be permanently removed from this device.`,
    [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => { await removeContact(contact.id); router.back(); } },
    ]
  );

  if (editing) {
    return (
      <Screen>
        <Text style={{ color: c.text, fontSize: 25, fontWeight: '800', marginBottom: 24 }}>Edit contact</Text>
        <ContactForm
          initial={{ firstName: contact.firstName, lastName: contact.lastName, mobilePhone: contact.mobilePhone, notes: contact.notes }}
          submitLabel="Save changes"
          onSubmit={async value => { await editContact(contact.id, value); setEditing(false); }}
        />
        <Text onPress={() => setEditing(false)} style={{ color: c.primary, textAlign: 'center', marginTop: 20, fontWeight: '600' }}>Cancel editing</Text>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.hero}>
        <ContactAvatar firstName={contact.firstName} lastName={contact.lastName} size={92} />
        <Text style={[styles.name, { color: c.text }]}>{contact.firstName} {contact.lastName}</Text>
        <Text style={{ color: c.muted, fontSize: 14 }}>Contact</Text>
      </View>

      <Surface style={{ gap: 18 }}>
        <View style={styles.detailRow}>
          <View style={[styles.detailIcon, { backgroundColor: c.primarySoft }]}><Ionicons name="call-outline" size={19} color={c.primary} /></View>
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={{ color: c.muted, fontSize: 12 }}>Mobile phone</Text>
            <Text style={{ color: c.text, fontSize: 16, fontWeight: '600' }}>{contact.mobilePhone}</Text>
          </View>
          <Pressable onPress={() => Linking.openURL(`tel:${contact.mobilePhone}`)}><Ionicons name="call" size={20} color={c.primary} /></Pressable>
        </View>
        <View style={[styles.divider, { backgroundColor: c.border }]} />
        <View style={styles.detailRow}>
          <View style={[styles.detailIcon, { backgroundColor: c.primarySoft }]}><Ionicons name="document-text-outline" size={19} color={c.primary} /></View>
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={{ color: c.muted, fontSize: 12 }}>Notes</Text>
            <Text style={{ color: contact.notes ? c.text : c.muted, fontSize: 15, lineHeight: 22 }}>{contact.notes || 'No notes added'}</Text>
          </View>
        </View>
      </Surface>

      <Pressable onPress={() => setEditing(true)} style={[styles.primaryButton, { backgroundColor: c.primary }]}>
        <Ionicons name="create-outline" size={19} color="#fff" /><Text style={styles.primaryText}>Edit contact</Text>
      </Pressable>
      <Pressable onPress={confirmDelete} style={[styles.deleteButton, { borderColor: c.border }]}>
        <Ionicons name="trash-outline" size={18} color={c.danger} /><Text style={{ color: c.danger, fontWeight: '600' }}>Delete contact</Text>
      </Pressable>
    </Screen>
  );
}
const styles = StyleSheet.create({
  hero: { alignItems: 'center', paddingVertical: 22, gap: 9, marginBottom: 18 },
  name: { fontSize: 25, fontWeight: '800', marginTop: 7 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 13 },
  detailIcon: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  divider: { height: 1, marginLeft: 55 },
  primaryButton: { marginTop: 24, minHeight: 54, borderRadius: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9 },
  primaryText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  deleteButton: { marginTop: 12, minHeight: 52, borderRadius: 15, borderWidth: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9 },
});
