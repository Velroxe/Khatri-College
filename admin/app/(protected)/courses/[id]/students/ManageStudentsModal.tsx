"use client";

import { useEffect, useState } from "react";
import { CustomModal } from "@/components/CustomModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Student } from "@/lib/types";

export default function ManageStudentsModal({
  open,
  onOpenChange,
  courseId,
  currentStudents,
  onUpdated,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  courseId: string;
  currentStudents: Student[];
  onUpdated: () => void;
}) {
  const host = process.env.NEXT_PUBLIC_BACKEND;
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  const [initialSelected, setInitialSelected] = useState<(string | number)[]>([]);
  const [filter, setFilter] = useState("");
  const [saving, setSaving] = useState(false);

  // Fetch all students
  useEffect(() => {
    if (open) {
      (async () => {
        try {
          const res = await fetch(`${host}/api/students`, {
            credentials: "include",
          });
          if (!res.ok) throw new Error("Failed to fetch students");
          const data = await res.json();
          setAllStudents(data);
          const currentIds = currentStudents.map((s) => s.id);
          setSelectedIds(currentIds);
          setInitialSelected(currentIds);
        } catch (err) {
          console.error(err);
        }
      })();
    }
  }, [open]);

  // Toggle selection
  const toggleSelection = (id: string | number) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((sid) => sid !== id)
        : [...prev, id]
    );
  };

  const hasChanges = JSON.stringify(selectedIds) !== JSON.stringify(initialSelected);

  // Save changes
  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await fetch(`${host}/api/courses/${courseId}/students`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ studentIds: selectedIds }),
      });
      if (!res.ok) throw new Error("Failed to update students");
      onOpenChange(false);
      onUpdated();
    } catch (err) {
      console.error(err);
      alert("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  // Filter students
  const filteredStudents = allStudents.filter(
    (s) =>
      s.name.toLowerCase().includes(filter.toLowerCase()) ||
      s.email.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <CustomModal
      open={open}
      onOpenChange={onOpenChange}
      title="Manage Students"
    >
      {/* Modal Layout Wrapper: Ensure this container takes the full height available in the modal content area and uses flex for layout. */}
      <div className="flex flex-col h-full max-h-[80vh] overflow-hidden">
        {/* Filter Input (Fixed Header) */}
        <div className="p-3 pb-2 border-b shrink-0">
          <Input
            placeholder="Search students..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>

        {/* Scrollable List: Use flex-grow (flex-1) to take all remaining space, and set overflow-y-auto. */}
        <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
          <div className="divide-y border rounded-md">
            {filteredStudents.map((student) => (
              <label
                key={student.id}
                className="flex items-center justify-between p-3 hover:bg-accent cursor-pointer"
              >
                <div>
                  <p className="font-medium">{student.name}</p>
                  <p className="text-sm text-muted-foreground">{student.email}</p>
                </div>
                <input
                  type="checkbox"
                  checked={selectedIds.includes(student.id)}
                  onChange={() => toggleSelection(student.id)}
                  className="w-5 h-5"
                />
              </label>
            ))}

            {filteredStudents.length === 0 && (
              <div className="text-center py-6 text-muted-foreground text-sm">
                No students found
              </div>
            )}
          </div>
        </div>

        {/* Fixed Footer (Save/Cancel Buttons): Use shrink-0 to ensure it doesn't shrink. */}
        <div className="flex justify-end gap-2 border-t bg-background p-3 shrink-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!hasChanges || saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </CustomModal>
  );
}
