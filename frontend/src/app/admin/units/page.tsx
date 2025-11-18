"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AdminUnitsPage() {
  const [units, setUnits] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(false);

  const fetchUnits = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/units");
      if (!res.ok) throw new Error("Failed to fetch units");
      const data = await res.json();
      setUnits(data);
    } catch (err) {
      console.error(err);
      setUnits([]);
    } finally {
      setLoading(false);
    }
  };

  const [form, setForm] = useState({ code: "", description: "" });

  const createUnit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/units", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: form.code, description: form.description }),
      });
      if (!res.ok) throw new Error("Failed to create unit");
      setForm({ code: "", description: "" });
      await fetchUnits();
    } catch (err) {
      console.error(err);
      alert("Could not create unit");
    }
  };

  const deleteUnit = async (code: string) => {
    if (!confirm("Delete this unit?")) return;
    try {
      const res = await fetch(`http://localhost:5000/units/${encodeURIComponent(code)}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      await fetchUnits();
    } catch (err) {
      console.error(err);
      alert("Could not delete unit");
    }
  };

  useEffect(() => { void fetchUnits(); }, []);

  return (
    <section>
      <h1 className="text-2xl font-semibold mb-4">Units</h1>
      <Card className="p-4 bg-gray-800/60 text-white">
        <CardContent>
          <form onSubmit={createUnit} className="mb-4 space-y-2">
            <div className="flex gap-2">
              <Input placeholder="Code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
            </div>
            <Input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <div>
              <Button type="submit">Create unit</Button>
            </div>
          </form>
          {loading ? (
            <div>Loading...</div>
          ) : units.length ? (
            <div className="space-y-2">
              {units.map((u: any) => (
                <div key={u.unit_code} className="flex items-center justify-between bg-gray-700/40 p-2 rounded">
                  <div>{u.unit_code} — <span className="text-sm text-white/60">{u.description}</span></div>
                  <div>
                    <Button variant="destructive" onClick={() => void deleteUnit(u.unit_code)}>Delete</Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-white/70">No units found.</div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
