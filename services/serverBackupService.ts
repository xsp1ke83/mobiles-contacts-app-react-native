import type { ContactInput } from '@/types/contact';

// Set EXPO_PUBLIC_API_BASE_URL in the project's .env file.
// Example: EXPO_PUBLIC_API_BASE_URL=https://api.example.com
const API_BASE_URL = (process.env.EXPO_PUBLIC_API_BASE_URL ?? '').trim();

type ServerSaveResponse = {
  savingName: string;
  count: number;
  Created: boolean;
};

type ServerImportResponse = {
  savingName: string;
  contacts: ContactInput[];
};

type ApiErrorBody = { error?: string };

function getApiUrl(path: string) {
  if (!API_BASE_URL) {
    throw new Error(
      'Не налаштовано адресу API. Додайте EXPO_PUBLIC_API_BASE_URL у файл .env та перезапустіть Expo.'
    );
  }
  return `${API_BASE_URL.replace(/\/+$/, '')}${path}`;
}

async function readError(response: Response, fallback: string): Promise<Error> {
  let message = fallback;
  try {
    const body = (await response.json()) as ApiErrorBody;
    if (typeof body?.error === 'string' && body.error.trim()) message = body.error;
  } catch {
    // Error response may be empty or non-JSON.
  }
  if (response.status === 400 && message === fallback) return new Error('Некоректні дані запиту (400).');
  if (response.status === 403 && message === fallback) return new Error('Неправильний пароль для цього збереження (403).');
  if (response.status === 404 && message === fallback) return new Error('Збереження з такою назвою не знайдено (404).');
  return new Error(message === fallback ? `${fallback} Код: ${response.status}.` : message);
}

function validateCredentials(savingName: string, savingPassword: string) {
  if (savingName.length < 3 || savingName.length > 50) {
    throw new Error('Назва збереження має містити від 3 до 50 символів.');
  }
  if (savingPassword.length < 6 || savingPassword.length > 64) {
    throw new Error('Пароль має містити від 6 до 64 символів.');
  }
}

function validateContacts(contacts: ContactInput[]) {
  if (!Array.isArray(contacts)) throw new Error('Список контактів має бути масивом.');
  contacts.forEach((contact, index) => {
    const prefix = `Контакт ${index + 1}:`;
    if (!contact || typeof contact !== 'object') throw new Error(`${prefix} некоректний об'єкт.`);
    if (typeof contact.firstName !== 'string' || contact.firstName.trim().length < 1 || contact.firstName.length > 50) {
      throw new Error(`${prefix} ім'я має містити від 1 до 50 символів.`);
    }
    if (typeof contact.lastName !== 'string' || contact.lastName.trim().length < 1 || contact.lastName.length > 50) {
      throw new Error(`${prefix} прізвище має містити від 1 до 50 символів.`);
    }
    if (!/^\d{12}$/.test(String(contact.mobilePhone))) {
      throw new Error(`${prefix} номер телефону має містити рівно 12 цифр.`);
    }
    if (contact.notes !== null && typeof contact.notes !== 'string') {
      throw new Error(`${prefix} нотатка має бути рядком або null.`);
    }
  });
}

export async function exportToServer(
  savingName: string,
  savingPassword: string,
  contacts: ContactInput[]
): Promise<ServerSaveResponse> {
  const normalizedName = savingName.trim();
  validateCredentials(normalizedName, savingPassword);
  validateContacts(contacts);

  const response = await fetch(getApiUrl('/putContactSaving'), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ savingName: normalizedName, savingPassword, contacts }),
  });
  if (!response.ok) throw await readError(response, 'Не вдалося експортувати контакти.');

  const result = (await response.json()) as Partial<ServerSaveResponse>;
  if (typeof result.savingName !== 'string' || typeof result.count !== 'number' || typeof result.Created !== 'boolean') {
    throw new Error('Сервер повернув некоректну відповідь під час експорту.');
  }
  return result as ServerSaveResponse;
}

export async function importFromServer(
  savingName: string,
  savingPassword: string
): Promise<ServerImportResponse> {
  const normalizedName = savingName.trim();
  validateCredentials(normalizedName, savingPassword);

  // POST keeps the password out of the URL/query string.
  const response = await fetch(getApiUrl('/getContactSaving'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ SavingName: normalizedName, SavingPassword: savingPassword }),
  });
  if (!response.ok) throw await readError(response, 'Не вдалося завантажити збереження.');

  const data = (await response.json()) as Partial<ServerImportResponse>;
  if (typeof data.savingName !== 'string' || !Array.isArray(data.contacts)) {
    throw new Error('Сервер повернув некоректні дані збереження.');
  }
  validateContacts(data.contacts as ContactInput[]);
  return data as ServerImportResponse;
}
