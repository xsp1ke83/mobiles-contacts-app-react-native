import React, { useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp, useAppColors } from '@/context/AppContext';
import { darkColors, lightColors } from '@/constants/theme';
import { exportToServer, importFromServer } from '@/services/serverBackupService';

export function BackupModal({ visible, mode, onClose }: {
  visible: boolean;
  mode: 'import' | 'export';
  onClose: () => void;
}) {
  const { contacts, replaceContacts } = useApp();
  const { isDark } = useAppColors();
  const c = isDark ? darkColors : lightColors;
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = () => {
    if (!name.trim() || !password.trim()) {
      Alert.alert('Missing details', 'Enter both saving name and password.');
      return;
    }
    if (mode === 'import') {
      Alert.alert(
        'Replace local contacts?',
        'Importing this backup will permanently replace all contacts currently stored on this device.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Import', style: 'destructive', onPress: run },
        ]
      );
    } else run();
  };

  const run = async () => {
    setBusy(true);
    try {
      if (mode === 'export') {
        await exportToServer(name.trim(), password, contacts.map(({ firstName, lastName, mobilePhone, notes }) => ({ firstName, lastName, mobilePhone, notes })));
        Alert.alert('Export complete', 'Your contacts were saved to the server.');
      } else {
        const result = await importFromServer(name.trim(), password);
        await replaceContacts(result.contacts);
        Alert.alert('Import complete', `${result.contacts.length} contacts imported.`);
      }
      setName(''); setPassword(''); onClose();
    } catch (error) {
      Alert.alert(mode === 'export' ? 'Export failed' : 'Import failed', error instanceof Error ? error.message : 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ width: '100%' }}>
          <View style={[styles.sheet, { backgroundColor: c.surface }]}>
            <View style={styles.sheetHeader}>
              <View style={{ flex: 1, gap: 5 }}>
                <Text style={{ color: c.text, fontSize: 21, fontWeight: '800' }}>{mode === 'import' ? 'Import from server' : 'Export to server'}</Text>
                <Text style={{ color: c.muted, fontSize: 13, lineHeight: 19 }}>Use your backup name and password to {mode === 'import' ? 'restore' : 'save'} contacts.</Text>
              </View>
              <Pressable onPress={onClose} style={[styles.close, { backgroundColor: c.surfaceSecondary }]}><Ionicons name="close" size={21} color={c.text} /></Pressable>
            </View>
            <Text style={[styles.label, { color: c.text }]}>Saving name</Text>
            <TextInput value={name} onChangeText={setName} placeholder="e.g. MyContacts" placeholderTextColor={c.muted} autoCapitalize="none" style={[styles.input, { backgroundColor: c.input, color: c.text, borderColor: c.border }]} />
            <Text style={[styles.label, { color: c.text, marginTop: 15 }]}>Password</Text>
            <TextInput value={password} onChangeText={setPassword} placeholder="Enter backup password" placeholderTextColor={c.muted} secureTextEntry style={[styles.input, { backgroundColor: c.input, color: c.text, borderColor: c.border }]} />
            {mode === 'import' && <View style={[styles.warning, { backgroundColor: isDark ? '#3A2925' : '#FFF4E8' }]}><Ionicons name="warning-outline" size={18} color="#C47A2C" /><Text style={{ color: isDark ? '#F1BD83' : '#92551C', flex: 1, fontSize: 12, lineHeight: 18 }}>Import replaces the current contact list on this device.</Text></View>}
            <Pressable disabled={busy} onPress={submit} style={[styles.submit, { backgroundColor: c.primary, opacity: busy ? 0.65 : 1 }]}>
              {busy ? <ActivityIndicator color="#fff" /> : <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>{mode === 'import' ? 'Import contacts' : 'Export contacts'}</Text>}
            </Pressable>
            <Text style={{ color: c.muted, fontSize: 11, textAlign: 'center', marginTop: 12 }}>Credentials are used only for this operation.</Text>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end', alignItems: 'center' },
  sheet: { borderTopLeftRadius: 26, borderTopRightRadius: 26, padding: 22, paddingBottom: 34 },
  sheetHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 22 },
  close: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: 13, fontWeight: '700', marginBottom: 8 },
  input: { height: 52, borderRadius: 13, borderWidth: 1, paddingHorizontal: 14, fontSize: 14 },
  warning: { flexDirection: 'row', gap: 9, alignItems: 'center', padding: 12, borderRadius: 12, marginTop: 17 },
  submit: { height: 54, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginTop: 22 },
});
