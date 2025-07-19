export interface Contact {
  id: string
  name: string
  email: string
  phone?: string
  group?: string
}

export const CONTACT_GROUPS = ["Friends", "Work", "Family", "Other"] as const
export type ContactGroup = (typeof CONTACT_GROUPS)[number]

const STORAGE_KEY = "contacts"

// Default contacts
const DEFAULT_CONTACTS: Contact[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@email.com",
    phone: "+1 (555) 123-4567",
    group: "Work",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@email.com",
    phone: "+1 (555) 987-6543",
    group: "Friends",
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob.johnson@email.com",
    phone: "+1 (555) 456-7890",
    group: "Family",
  },
  {
    id: "4",
    name: "Alice Brown",
    email: "alice.brown@email.com",
    group: "Work",
  },
  {
    id: "5",
    name: "Charlie Wilson",
    email: "charlie.wilson@email.com",
    phone: "+1 (555) 321-6547",
    group: "Friends",
  },
]

export const getContacts = (): Contact[] => {
  if (typeof window === "undefined") return []

  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) {
    // Initialize with default contacts
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CONTACTS))
    return DEFAULT_CONTACTS
  }

  try {
    return JSON.parse(stored)
  } catch {
    return DEFAULT_CONTACTS
  }
}

export const saveContacts = (contacts: Contact[]): void => {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts))
}

export const addContact = (contact: Omit<Contact, "id">): Contact => {
  const contacts = getContacts()
  const newContact: Contact = {
    ...contact,
    id: Date.now().toString(),
  }
  const updatedContacts = [...contacts, newContact]
  saveContacts(updatedContacts)
  return newContact
}

export const updateContact = (id: string, updates: Partial<Contact>): Contact | null => {
  const contacts = getContacts()
  const index = contacts.findIndex((c) => c.id === id)

  if (index === -1) return null

  const updatedContact = { ...contacts[index], ...updates }
  contacts[index] = updatedContact
  saveContacts(contacts)
  return updatedContact
}

export const deleteContact = (id: string): boolean => {
  const contacts = getContacts()
  const filteredContacts = contacts.filter((c) => c.id !== id)

  if (filteredContacts.length === contacts.length) return false

  saveContacts(filteredContacts)
  return true
}

export const getContactById = (id: string): Contact | null => {
  const contacts = getContacts()
  return contacts.find((c) => c.id === id) || null
}
