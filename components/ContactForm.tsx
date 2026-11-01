import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAppColors } from '@/context/AppContext';
import { darkColors, lightColors } from '@/constants/theme';
import type { ContactInput } from '@/types/contact';

export function ContactForm({ initial, onSubmit, submitLabel }: {
  initial?: ContactInput;
  onSubmit: (value: ContactInput) => Promise<void>;
  submitLabel: string;
}) {
  const { isDark } = useAppColors();
  const c = isDark ? darkColors : lightColors;
  const [firstName, setFirstName] = useState(initial?.firstName ?? '');
  const [lastName, setLastName] = useState(initial?.lastName ?? '');
  const [mobilePhone, setMobilePhone] = useState(initial?.mobilePhone ?? '');
  const [notes, setNotes] = useState(initial?.notes ?? '');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const field = (label: string, value: string, setter: (v: string) => void, placeholder: string, multiline = false, keyboardType: 'default' | 'phone-pad' = 'default') => (
    <View style={styles.field}>
      <Text style={[styles.label, { color: c.text }]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={setter}
        placeholder={placeholder}
        placeholderTextColor={c.muted}
        keyboardType={keyboardType}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        style={[
          styles.input,
          { backgroundColor: c.input, color: c.text, borderColor: c.border },
          multiline && styles.notes,
        ]}
      />
    </View>
  );

  const submit = async () => {
    if (!firstName.trim() || !lastName.trim() || !mobilePhone.trim()) {
      setError('Please fill in first name, last name and mobile phone.');
      return;
    }
    setError('');
    setSaving(true);
    try {
      await onSubmit({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        mobilePhone: mobilePhone.trim(),
        notes: notes.trim() || null,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <View style={{ gap: 18 }}>
        {field('First name *', firstName, setFirstName, 'e.g. John')}
        {field('Last name *', lastName, setLastName, 'e.g. Snow')}
        {field('Mobile phone *', mobilePhone, setMobilePhone, '+380 00 000 00 00', false, 'phone-pad')}
        {field('Notes', notes, setNotes, 'Add a note about this contact...', true)}
        {!!error && <Text style={{ color: c.danger, fontSize: 13 }}>{error}</Text>}
        <Text onPress={submit} style={[styles.button, { backgroundColor: c.primary, opacity: saving ? 0.6 : 1 }]}>
          {saving ? 'Saving…' : submitLabel}
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  field: { gap: 8 },
  label: { fontSize: 14, fontWeight: '600' },
  input: { minHeight: 54, borderRadius: 14, borderWidth: 1, paddingHorizontal: 16, fontSize: 15 },
  notes: { minHeight: 112, paddingTop: 15 },
  button: { color: '#FFFFFF', overflow: 'hidden', textAlign: 'center', paddingVertical: 17, borderRadius: 15, fontWeight: '700', fontSize: 15 },
});
