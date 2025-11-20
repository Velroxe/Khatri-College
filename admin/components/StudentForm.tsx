"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Student } from "@/lib/types";

interface Props {
  student: Student | null;
  host: string;
  loading: boolean;
  setLoading: (v: boolean) => void;
  onSuccess: () => void;
}

export default function StudentForm({
  student,
  host,
  loading,
  setLoading,
  onSuccess,
}: Props) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    status: "active",
  });

  useEffect(() => {
    if (student) setFormData(student);
  }, [student]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const method = student ? "PUT" : "POST";
      const url = student
        ? `${host}/api/students/${student.id}`
        : `${host}/api/students`;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to save student");
      onSuccess();
    } catch (err) {
      console.error(err);
      alert("Error saving student");
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

      {!student && <div className="text-sm">
        Defualt password: <i><u>password123</u></i>
      </div>}

      <div>
        <label className="block text-sm font-medium mb-2">Status</label>
        <div className="flex gap-6">
          {["active", "suspended", "left"].map((status) => (
            <label key={status} className="flex items-center gap-2">
              <input
                type="radio"
                name="status"
                value={status}
                checked={formData.status === status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
              />
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-3">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : student ? "Save Changes" : "Add Student"}
        </Button>
      </div>
    </form>
  );
}
