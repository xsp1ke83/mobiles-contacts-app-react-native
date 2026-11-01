import * as repository from '@/database/database';
import type { ContactInput } from '@/types/contact';

export const contactService = {
  getAll: () => repository.getContacts(),
  getById: (id: number) => repository.getContactById(id),
  create: (input: ContactInput) => repository.createContact(input),
  update: (id: number, input: ContactInput) => repository.updateContact(id, input),
  remove: (id: number) => repository.deleteContact(id),
  replaceAll: (items: ContactInput[]) => repository.replaceAllContacts(items),
};
