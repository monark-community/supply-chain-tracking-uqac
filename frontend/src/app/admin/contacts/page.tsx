"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Contact {
  id?: string;
  name: string;
  email: string;
  notes?: string | null;
}

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(false);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/contacts");
      if (!res.ok) throw new Error("Failed to fetch contacts");
      const data = await res.json();
      setContacts(data);
    } catch (err) {
      console.error(err);
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  const [form, setForm] = useState<Contact>({ name: "", email: "", notes: "" });

  const createContact = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to create contact");
      setForm({ name: "", email: "", notes: "" });
      await fetchContacts();
    } catch (err) {
      console.error(err);
      alert("Could not create contact");
    }
  };

  const deleteContact = async (id: string) => {
    if (!confirm("Delete this contact?")) return;
    try {
      const res = await fetch(`http://localhost:5000/contacts/${encodeURIComponent(id)}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      await fetchContacts();
    } catch (err) {
      console.error(err);
      alert("Could not delete contact");
    }
  };

  useEffect(() => { void fetchContacts(); }, []);

  return (
    <section>
      <h1 className="text-2xl font-semibold mb-4">Contacts</h1>
      <Card className="p-4 bg-gray-800/60 text-white">
        <CardContent>
          <form onSubmit={createContact} className="mb-4 space-y-2">
            <div className="flex gap-2">
              <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <Input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <Input placeholder="Notes" value={form.notes ?? ""} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            <div>
              <Button type="submit">Create contact</Button>
            </div>
          </form>
          {loading ? (
            <div>Loading...</div>
          ) : contacts.length ? (
            <div className="space-y-2">
              {contacts.map((c: any) => (
                <div key={c.id} className="flex items-center justify-between bg-gray-700/40 p-2 rounded">
                  <div>{c.name} <span className="text-sm text-white/60">{c.email}</span></div>
                  <div>
                    <Button variant="destructive" onClick={() => void deleteContact(c.id)}>Delete</Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-white/70">No contacts found.</div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
