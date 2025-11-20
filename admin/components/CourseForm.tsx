"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Course } from "@/lib/types";

interface Props {
  course: Course | null;
  host: string;
  loading: boolean;
  setLoading: (v: boolean) => void;
  onSuccess: () => void;
}

export default function CourseForm({
  course,
  host,
  loading,
  setLoading,
  onSuccess,
}: Props) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "ongoing",
  });

  useEffect(() => {
    if (course) setFormData(course);
  }, [course]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const method = course ? "PUT" : "POST";
      const url = course
        ? `${host}/api/courses/${course.id}`
        : `${host}/api/courses`;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to save course");
      onSuccess();
    } catch (err) {
      console.error(err);
      alert("Error saving course");
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
        <label className="block text-sm font-medium mb-1">Description</label>
        <Input
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Status</label>
        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="status"
              value="ongoing"
              checked={formData.status === "ongoing"}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
            />
            Ongoing
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="status"
              value="completed"
              checked={formData.status === "completed"}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
            />
            Completed
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-3">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : course ? "Save Changes" : "Add Course"}
        </Button>
      </div>
    </form>
  );
}
