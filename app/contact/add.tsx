import React from 'react';
import { Alert, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { ContactForm } from '@/components/ContactForm';
import { useApp, useAppColors } from '@/context/AppContext';
import { darkColors, lightColors } from '@/constants/theme';

export default function AddContactScreen() {
  const router = useRouter();
  const { addContact } = useApp();
  const { isDark } = useAppColors();
  const c = isDark ? darkColors : lightColors;
  return (
    <Screen>
      <View style={{ gap: 8, marginBottom: 26 }}>
        <Text style={{ color: c.text, fontSize: 25, fontWeight: '800' }}>Create contact</Text>
        <Text style={{ color: c.muted, fontSize: 14, lineHeight: 21 }}>Add the details below. Fields marked with * are required.</Text>
      </View>
      <ContactForm submitLabel="Save contact" onSubmit={async value => {
        await addContact(value);
        Alert.alert('Contact saved', `${value.firstName} ${value.lastName} was added to your contacts.`);
        router.back();
      }} />
    </Screen>
  );
}
