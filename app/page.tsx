"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Plus, Users } from "lucide-react"
import { type Contact, getContacts, addContact, updateContact, deleteContact } from "@/lib/contacts"
import ContactList from "@/components/contact-list"
import ContactForm from "@/components/contact-form"
import DeleteDialog from "@/components/delete-dialog"

export default function ContactManagement() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingContact, setEditingContact] = useState<Contact | null>(null)
  const [deletingContact, setDeletingContact] = useState<Contact | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setContacts(getContacts())
  }, [])

  const handleAddContact = (contactData: Omit<Contact, "id">) => {
    const newContact = addContact(contactData)
    setContacts((prev) => [...prev, newContact])
    setShowAddForm(false)
  }

  const handleEditContact = (contactData: Omit<Contact, "id">) => {
    if (!editingContact) return

    const updatedContact = updateContact(editingContact.id, contactData)
    if (updatedContact) {
      setContacts((prev) => prev.map((c) => (c.id === editingContact.id ? updatedContact : c)))
    }
    setEditingContact(null)
  }

  const handleDeleteContact = () => {
    if (!deletingContact) return

    const success = deleteContact(deletingContact.id)
    if (success) {
      setContacts((prev) => prev.filter((c) => c.id !== deletingContact.id))
    }
    setDeletingContact(null)
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Loading contacts...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold flex items-center gap-2">
                    <Users className="h-6 w-6" />
                    Contact Management
                  </CardTitle>
                  <CardDescription>Manage your contacts with search, filter, and organization features</CardDescription>
                </div>
                <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Contact
                </Button>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Contact List */}
        <ContactList contacts={contacts} onEdit={setEditingContact} onDelete={setDeletingContact} />

        {/* Add Contact Dialog */}
        <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
          <DialogContent className="max-w-md">
            <ContactForm onSubmit={handleAddContact} onCancel={() => setShowAddForm(false)} />
          </DialogContent>
        </Dialog>

        {/* Edit Contact Dialog */}
        <Dialog open={!!editingContact} onOpenChange={() => setEditingContact(null)}>
          <DialogContent className="max-w-md">
            {editingContact && (
              <ContactForm
                contact={editingContact}
                onSubmit={handleEditContact}
                onCancel={() => setEditingContact(null)}
                isEditing
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <DeleteDialog
          contact={deletingContact}
          open={!!deletingContact}
          onConfirm={handleDeleteContact}
          onCancel={() => setDeletingContact(null)}
        />
      </div>
    </div>
  )
}
