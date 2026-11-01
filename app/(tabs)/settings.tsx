import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Surface } from '@/components/Screen';
import { BackupModal } from '@/components/BackupModal';
import { useApp, useAppColors } from '@/context/AppContext';
import { darkColors, lightColors } from '@/constants/theme';
import { exportContactsJson, importContactsJson } from '@/services/importExportService';
import type { ThemeMode } from '@/types/contact';

function SettingRow({ icon, title, subtitle, onPress, danger = false }: {
  icon: keyof typeof Ionicons.glyphMap; title: string; subtitle: string; onPress: () => void; danger?: boolean;
}) {
  const { isDark } = useAppColors();
  const c = isDark ? darkColors : lightColors;
  return (
    <Pressable onPress={onPress} style={styles.row}>
      <View style={[styles.rowIcon, { backgroundColor: danger ? (isDark ? '#43282B' : '#FDEBEC') : c.primarySoft }]}>
        <Ionicons name={icon} size={19} color={danger ? c.danger : c.primary} />
      </View>
      <View style={{ flex: 1, gap: 4 }}>
        <Text style={{ color: danger ? c.danger : c.text, fontSize: 14, fontWeight: '700' }}>{title}</Text>
        <Text style={{ color: c.muted, fontSize: 11, lineHeight: 16 }}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={c.muted} />
    </Pressable>
  );
}

export default function SettingsScreen() {
  const { contacts, themeMode, setThemeMode, replaceContacts } = useApp();
  const { isDark } = useAppColors();
  const c = isDark ? darkColors : lightColors;
  const [backupMode, setBackupMode] = useState<'import' | 'export' | null>(null);

  const chooseTheme = () => Alert.alert('Appearance', 'Choose how Contacts App should look.', [
    { text: 'System', onPress: () => setThemeMode('system') },
    { text: 'Light', onPress: () => setThemeMode('light') },
    { text: 'Dark', onPress: () => setThemeMode('dark') },
    { text: 'Cancel', style: 'cancel' },
  ]);

  const importLocal = async () => {
    try {
      const items = await importContactsJson();
      if (!items) return;
      Alert.alert(
        'Replace contacts?',
        `This will replace all ${contacts.length} contacts on this device with ${items.length} imported contacts.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Import', style: 'destructive', onPress: async () => {
            try { await replaceContacts(items); Alert.alert('Import complete', `${items.length} contacts imported.`); }
            catch (e) { Alert.alert('Import failed', e instanceof Error ? e.message : 'Something went wrong.'); }
          }},
        ]
      );
    } catch (e) {
      Alert.alert('Import failed', e instanceof Error ? e.message : 'Could not import this file.');
    }
  };

  const exportLocal = async () => {
    try {
      await exportContactsJson(contacts);
    } catch (e) {
      Alert.alert('Export failed', e instanceof Error ? e.message : 'Could not export contacts.');
    }
  };

  const clearContacts = () => Alert.alert('Delete all contacts?', 'This action cannot be undone.', [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Delete all', style: 'destructive', onPress: async () => {
      try { await replaceContacts([]); Alert.alert('Contacts cleared', 'All local contacts were deleted.'); }
      catch { Alert.alert('Error', 'Could not clear contacts.'); }
    }},
  ]);

  const themeLabel: Record<ThemeMode, string> = { system: 'System default', light: 'Light', dark: 'Dark' };

  return (
    <Screen>
      <View style={{ marginTop: 8, marginBottom: 26 }}>
        <Text style={[styles.title, { color: c.text }]}>Settings</Text>
        <Text style={{ color: c.muted, fontSize: 13, marginTop: 6 }}>Manage your app preferences and data.</Text>
      </View>

      <Text style={[styles.section, { color: c.muted }]}>PREFERENCES</Text>
      <Surface style={{ paddingVertical: 2, marginBottom: 24 }}>
        <SettingRow icon="color-palette-outline" title="Appearance" subtitle={themeLabel[themeMode]} onPress={chooseTheme} />
      </Surface>

      <Text style={[styles.section, { color: c.muted }]}>LOCAL DATA</Text>
      <Surface style={{ paddingVertical: 2, marginBottom: 24 }}>
        <View style={styles.storageHeader}>
          <View style={[styles.rowIcon, { backgroundColor: c.primarySoft }]}><Ionicons name="phone-portrait-outline" size={19} color={c.primary} /></View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: c.text, fontWeight: '700', fontSize: 14 }}>On this device</Text>
            <Text style={{ color: c.muted, fontSize: 11, marginTop: 4 }}>SQLite local database</Text>
          </View>
          <Text style={{ color: c.primary, fontWeight: '800', fontSize: 17 }}>{contacts.length}</Text>
        </View>
        <View style={[styles.divider, { backgroundColor: c.border }]} />
        <SettingRow icon="download-outline" title="Import JSON" subtitle="Replace contacts from a local .json file" onPress={importLocal} />
        <View style={[styles.divider, { backgroundColor: c.border }]} />
        <SettingRow icon="share-outline" title="Export JSON" subtitle="Share a backup of your contacts" onPress={exportLocal} />
        <View style={[styles.divider, { backgroundColor: c.border }]} />
        <SettingRow icon="trash-outline" title="Clear all contacts" subtitle="Permanently delete local contacts" onPress={clearContacts} danger />
      </Surface>

      <Text style={[styles.section, { color: c.muted }]}>SERVER BACKUP</Text>
      <Surface style={{ paddingVertical: 2, marginBottom: 24 }}>
        <SettingRow icon="cloud-download-outline" title="Import from server" subtitle="Restore contacts using backup name and password" onPress={() => setBackupMode('import')} />
        <View style={[styles.divider, { backgroundColor: c.border }]} />
        <SettingRow icon="cloud-upload-outline" title="Export to server" subtitle="Save or overwrite a password-protected backup" onPress={() => setBackupMode('export')} />
      </Surface>

      <Text style={[styles.section, { color: c.muted }]}>ABOUT</Text>
      <Surface style={{ paddingVertical: 16 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ color: c.text, fontWeight: '700' }}>Contacts App</Text>
          <Text style={{ color: c.muted, fontSize: 12 }}>Version 1.0.0</Text>
        </View>
        <Text style={{ color: c.muted, fontSize: 12, marginTop: 8, lineHeight: 18 }}>A simple personal address book built with React Native, Expo and SQLite.</Text>
      </Surface>

      <BackupModal visible={backupMode !== null} mode={backupMode ?? 'export'} onClose={() => setBackupMode(null)} />
    </Screen>
  );
}
const styles = StyleSheet.create({
  title: { fontSize: 32, fontWeight: '800', letterSpacing: -0.8 },
  section: { fontSize: 10, letterSpacing: 1.2, fontWeight: '800', marginBottom: 10, marginLeft: 4 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 13, paddingVertical: 14 },
  rowIcon: { width: 40, height: 40, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  storageHeader: { flexDirection: 'row', alignItems: 'center', gap: 13, paddingVertical: 14 },
  divider: { height: 1, marginLeft: 53 },
});
