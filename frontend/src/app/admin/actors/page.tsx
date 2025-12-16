"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { API_URL } from "@/lib/env";

export default function AdminActorsPage() {
  const [actors, setActors] = useState<Array<{ id: number; name: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);

  const fetchActors = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/actors`);
      if (!res.ok) throw new Error("Failed to fetch actors");
      const data = await res.json();
      setActors(data);
    } catch (err) {
      setActors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void fetchActors(); }, []);

  const createActor = async () => {
    if (!newName.trim()) return;
    setCreating(true);
    try {
      const res = await fetch(`${API_URL}/actors`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim() }),
      });
      if (!res.ok) throw new Error("Failed to create actor");
      const created = await res.json();
      setActors((p) => [created, ...p]);
      setNewName("");
    } catch (err) {
      // Silently fail
    } finally {
      setCreating(false);
    }
  };

  const deleteActor = async (id: number) => {
    if (!confirm("Supprimer cet acteur ?")) return;
    try {
      const res = await fetch(`${API_URL}/actors/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete actor");
      setActors((p) => p.filter((a) => a.id !== id));
    } catch (err) {
      // Silently fail
    }
  };

  return (
    <section>
      <h1 className="text-2xl font-semibold mb-4">Actors administration</h1>
      <Card className="p-4 bg-gray-800/60 text-white">
        <CardContent>
          <div className="flex gap-2">
            <Input placeholder="New actor name" value={newName} onChange={(e) => setNewName(e.target.value)} />
            <Button className="bg-green-600" onClick={createActor} disabled={creating}>{creating ? "Creating..." : "Create"}</Button>
          </div>
          <div className="mt-4">
            {loading ? (
              <div>Loading...</div>
            ) : actors.length ? (
              <div className="space-y-2">
                {actors.map((a) => (
                  <div key={a.id} className="flex items-center justify-between bg-gray-700/40 p-2 rounded">
                    <div>{a.name} <span className="text-sm text-white/60">(id: {a.id})</span></div>
                    <div>
                      <Button className="bg-red-600" onClick={() => void deleteActor(a.id)}>Delete</Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-white/70">No actors found.</div>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
