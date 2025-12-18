"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { API_URL } from "@/lib/env";

export default function AdminActorCategoriesPage() {
  const [cats, setCats] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(false);

  const fetchCats = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/actor-categories`);
      if (!res.ok) throw new Error("Failed to fetch actor categories");
      const data = await res.json();
      setCats(data);
    } catch (err) {
      console.error(err);
      setCats([]);
    } finally {
      setLoading(false);
    }
  };

  const [form, setForm] = useState({ name: "", description: "" });

  const createCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/actor-categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to create category");
      setForm({ name: "", description: "" });
      await fetchCats();
    } catch (err) {
      console.error(err);
      alert("Could not create category");
    }
  };

  const deleteCategory = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    try {
      const res = await fetch(`${API_URL}/actor-categories/${encodeURIComponent(id)}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      await fetchCats();
    } catch (err) {
      console.error(err);
      alert("Could not delete category");
    }
  };

  useEffect(() => { void fetchCats(); }, []);

  return (
    <section>
      <h1 className="text-2xl font-semibold mb-4">Actor Categories</h1>
      <Card className="p-4 bg-gray-800/60 text-white">
        <CardContent>
          <form onSubmit={createCategory} className="mb-4 space-y-2">
            <div className="flex gap-2">
              <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <Input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <Button type="submit">Create category</Button>
          </form>
          {loading ? (
            <div>Loading...</div>
          ) : cats.length ? (
            <div className="space-y-2">
              {cats.map((c: any) => (
                <div key={c.id} className="flex items-center justify-between bg-gray-700/40 p-2 rounded">
                  <div>{c.name}</div>
                  <div>
                    <Button variant="destructive" onClick={() => void deleteCategory(c.id)}>Delete</Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-white/70">No actor categories found.</div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
