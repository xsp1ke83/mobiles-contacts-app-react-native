import * as SQLite from 'expo-sqlite';
import type { Contact, ContactInput } from '@/types/contact';

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

export function getDatabase() {
  if (!dbPromise) dbPromise = SQLite.openDatabaseAsync('contacts.db');
  return dbPromise;
}

export async function initializeDatabase() {
  const db = await getDatabase();
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firstName TEXT NOT NULL,
      lastName TEXT NOT NULL,
      mobilePhone TEXT NOT NULL,
      notes TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_contacts_name ON contacts(lastName, firstName);
  `);
}

export async function getContacts(): Promise<Contact[]> {
  const db = await getDatabase();
  return db.getAllAsync<Contact>(
    'SELECT * FROM contacts ORDER BY lastName COLLATE NOCASE, firstName COLLATE NOCASE'
  );
}

export async function getContactById(id: number): Promise<Contact | null> {
  const db = await getDatabase();
  return db.getFirstAsync<Contact>('SELECT * FROM contacts WHERE id = ?', id);
}

export async function createContact(input: ContactInput) {
  const db = await getDatabase();
  const now = new Date().toISOString();
  const result = await db.runAsync(
    'INSERT INTO contacts (firstName, lastName, mobilePhone, notes, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)',
    input.firstName.trim(), input.lastName.trim(), input.mobilePhone.trim(),
    input.notes?.trim() || null, now, now
  );
  return result.lastInsertRowId;
}

export async function updateContact(id: number, input: ContactInput) {
  const db = await getDatabase();
  await db.runAsync(
    'UPDATE contacts SET firstName = ?, lastName = ?, mobilePhone = ?, notes = ?, updatedAt = ? WHERE id = ?',
    input.firstName.trim(), input.lastName.trim(), input.mobilePhone.trim(),
    input.notes?.trim() || null, new Date().toISOString(), id
  );
}

export async function deleteContact(id: number) {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM contacts WHERE id = ?', id);
}

export async function replaceAllContacts(items: ContactInput[]) {
  const db = await getDatabase();
  await db.withTransactionAsync(async () => {
    await db.runAsync('DELETE FROM contacts');
    const now = new Date().toISOString();
    for (const item of items) {
      await db.runAsync(
        'INSERT INTO contacts (firstName, lastName, mobilePhone, notes, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)',
        item.firstName.trim(), item.lastName.trim(), item.mobilePhone.trim(),
        item.notes?.trim() || null, now, now
      );
    }
  });
}
