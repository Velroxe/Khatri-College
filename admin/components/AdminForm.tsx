"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Admin } from "@/lib/types";

interface Props {
  admin: Admin | null;
  host: string;
  loading: boolean;
  setLoading: (v: boolean) => void;
  onSuccess: () => void;
}

export default function AdminForm({
  admin,
  host,
  loading,
  setLoading,
  onSuccess,
}: Props) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    if (admin) setFormData(admin);
  }, [admin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const method = admin ? "PUT" : "POST";
      const url = admin ? `${host}/api/admins/${admin.id}` : `${host}/api/admins`;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to save admin");
      onSuccess();
    } catch (err) {
      console.error(err);
      alert("Error saving admin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <Input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>

      {!admin && <div className="text-sm">
        Default password: <i><u>password123</u></i>
      </div>}

      <div className="flex justify-end gap-2 pt-3">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : admin ? "Save Changes" : "Add Admin"}
        </Button>
      </div>
    </form>
  );
}
