import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';
import { initializeDatabase } from '@/database/database';
import { contactService } from '@/services/contactService';
import type { Contact, ContactInput, ThemeMode } from '@/types/contact';

type AppContextValue = {
  contacts: Contact[];
  loading: boolean;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
  refreshContacts: () => Promise<void>;
  addContact: (input: ContactInput) => Promise<void>;
  editContact: (id: number, input: ContactInput) => Promise<void>;
  removeContact: (id: number) => Promise<void>;
  replaceContacts: (items: ContactInput[]) => Promise<void>;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');

  const refreshContacts = useCallback(async () => {
    const items = await contactService.getAll();
    setContacts(items);
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        await initializeDatabase();
        const savedTheme = await AsyncStorage.getItem('contacts-theme');
        if (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system') {
          if (active) setThemeModeState(savedTheme);
        }
        const items = await contactService.getAll();
        if (active) setContacts(items);
      } catch (error) {
        console.error('App initialization failed:', error);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const setThemeMode = useCallback(async (mode: ThemeMode) => {
    setThemeModeState(mode);
    await AsyncStorage.setItem('contacts-theme', mode);
  }, []);

  const addContact = useCallback(async (input: ContactInput) => {
    await contactService.create(input);
    await refreshContacts();
  }, [refreshContacts]);

  const editContact = useCallback(async (id: number, input: ContactInput) => {
    await contactService.update(id, input);
    await refreshContacts();
  }, [refreshContacts]);

  const removeContact = useCallback(async (id: number) => {
    await contactService.remove(id);
    await refreshContacts();
  }, [refreshContacts]);

  const replaceContacts = useCallback(async (items: ContactInput[]) => {
    await contactService.replaceAll(items);
    await refreshContacts();
  }, [refreshContacts]);

  const value = useMemo(() => ({
    contacts, loading, themeMode, setThemeMode, refreshContacts,
    addContact, editContact, removeContact, replaceContacts,
  }), [contacts, loading, themeMode, setThemeMode, refreshContacts, addContact, editContact, removeContact, replaceContacts]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used inside AppProvider');
  return context;
}

export function useAppColors() {
  const { themeMode } = useApp();
  const system = useColorScheme();
  const isDark = themeMode === 'system' ? system === 'dark' : themeMode === 'dark';
  return { isDark };
}
