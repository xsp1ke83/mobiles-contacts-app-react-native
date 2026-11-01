import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import type { Contact, ContactInput, ContactJson } from '@/types/contact';

function validateContacts(value: unknown): ContactInput[] {
  if (!Array.isArray(value)) throw new Error('JSON має містити масив контактів.');
  return value.map((item, index) => {
    if (!item || typeof item !== 'object') throw new Error(`Контакт №${index + 1} має некоректний формат.`);
    const contact = item as Record<string, unknown>;
    const firstName = contact.firstName;
    const lastName = contact.lastName;
    const mobilePhone = contact.mobilePhone;
    const notes = contact.notes;
    if (typeof firstName !== 'string' || !firstName.trim()) throw new Error(`Контакт №${index + 1}: відсутнє ім'я.`);
    if (typeof lastName !== 'string' || !lastName.trim()) throw new Error(`Контакт №${index + 1}: відсутнє прізвище.`);
    if (typeof mobilePhone !== 'string' || !mobilePhone.trim()) throw new Error(`Контакт №${index + 1}: відсутній номер.`);
    if (notes !== null && notes !== undefined && typeof notes !== 'string') throw new Error(`Контакт №${index + 1}: notes має бути рядком або null.`);
    return {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      mobilePhone: mobilePhone.trim(),
      notes: typeof notes === 'string' && notes.trim() ? notes.trim() : null,
    };
  });
}

export async function exportContactsJson(contacts: Contact[]) {
  const payload: ContactJson[] = contacts.map(({ firstName, lastName, mobilePhone, notes }) => ({
    firstName, lastName, mobilePhone, notes,
  }));
  const json = JSON.stringify(payload, null, 2);
  const fileUri = `${FileSystem.cacheDirectory}contacts-${new Date().toISOString().slice(0, 10)}.json`;
  await FileSystem.writeAsStringAsync(fileUri, json, { encoding: FileSystem.EncodingType.UTF8 });
  if (!(await Sharing.isAvailableAsync())) throw new Error('Системне поширення файлів недоступне на цьому пристрої.');
  await Sharing.shareAsync(fileUri, {
    mimeType: 'application/json',
    dialogTitle: 'Export contacts',
    UTI: 'public.json',
  });
}

export async function importContactsJson(): Promise<ContactInput[] | null> {
  const result = await DocumentPicker.getDocumentAsync({
    type: ['application/json', 'text/json', 'text/plain'],
    copyToCacheDirectory: true,
    multiple: false,
  });
  if (result.canceled || !result.assets?.[0]) return null;
  const raw = await FileSystem.readAsStringAsync(result.assets[0].uri, { encoding: FileSystem.EncodingType.UTF8 });
  let parsed: unknown;
  try { parsed = JSON.parse(raw); }
  catch { throw new Error('Не вдалося прочитати JSON. Перевірте формат файлу.'); }
  return validateContacts(parsed);
}
