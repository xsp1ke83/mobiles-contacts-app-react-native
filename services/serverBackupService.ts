import type { ContactInput } from '@/types/contact';

// Set this value when the backend is ready, e.g. https://api.example.com
const API_BASE_URL = '';

type ServerSaveResponse = {
  savingName: string;
  contacts: ContactInput[];
};

function getApiUrl(path: string) {
  if (!API_BASE_URL) {
    throw new Error('Server API ще не налаштовано. Додайте адресу сервера в services/serverBackupService.ts.');
  }
  return `${API_BASE_URL.replace(/\/$/, '')}${path}`;
}

export async function exportToServer(savingName: string, savingPassword: string, contacts: ContactInput[]) {
  const response = await fetch(getApiUrl('/putContactSaving'), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ savingName, savingPassword, contacts }),
  });
  if (!response.ok) throw new Error(`Сервер повернув помилку (${response.status}).`);
  return response.json();
}

export async function importFromServer(savingName: string, savingPassword: string): Promise<ServerSaveResponse> {
  const query = `SavingName=${encodeURIComponent(savingName)}&SavingPassword=${encodeURIComponent(savingPassword)}`;
  const response = await fetch(`${getApiUrl('/getContactSaving')}?${query}`);
  if (!response.ok) throw new Error(`Не вдалося завантажити збереження (${response.status}). Перевірте назву та пароль.`);
  const data = await response.json() as ServerSaveResponse;
  if (!Array.isArray(data.contacts)) throw new Error('Сервер повернув некоректний список контактів.');
  return data;
}
