export type Contact = {
  id: number;
  firstName: string;
  lastName: string;
  mobilePhone: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ContactInput = {
  firstName: string;
  lastName: string;
  mobilePhone: string;
  notes: string | null;
};

export type ContactJson = {
  firstName: string;
  lastName: string;
  mobilePhone: string;
  notes: string | null;
};

export type ThemeMode = 'system' | 'light' | 'dark';
