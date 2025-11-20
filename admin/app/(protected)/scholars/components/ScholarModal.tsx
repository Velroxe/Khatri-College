"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  uploadImageToSupabaseBucket,
  deleteImageFromSupabaseBucket,
} from "@/lib/supabaseUploadUtils";

import { Scholar } from "@/lib/types";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  scholarId: string | null;
  onSaved: () => void;
};

export function ScholarModal({
  open,
  onOpenChange,
  onSaved,
  scholarId,
}: Props) {
  const isEditing = !!scholarId;

  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [degree, setDegree] = useState("");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [initialImage, setInitialImage] = useState<string>("");

  const [imageRemoved, setImageRemoved] = useState(false);
  const [imageChanged, setImageChanged] = useState(false);

  const [scholar, setScholar] = useState<Scholar | null>(null);

  const [subjects, setSubjects] = useState<{ subject: string; marks: number }[]>(
    []
  );

  const host = process.env.NEXT_PUBLIC_BACKEND;

  // Reset modal form
  const resetForm = () => {
    setName("");
    setDegree("");
    setScholar(null);

    setImageFile(null);
    setImagePreview("");
    setInitialImage("");

    setImageRemoved(false);
    setImageChanged(false);

    setSubjects([]);
  };

  useEffect(() => {
    if (!open) resetForm();
  }, [open]);

  // Fetch scholar when editing
  useEffect(() => {
    if (!scholarId || !open) return;

    const fetchScholar = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${host}/api/scholars/${scholarId}`, {
          credentials: "include",
        });

        const data = await res.json();
        setScholar(data);

        setName(data.name);
        setDegree(data.degree);

        setImagePreview(data.image_url || "");
        setInitialImage(data.image_url || "");

        if (Array.isArray(data.subjects)) {
          setSubjects(
            data.subjects.map((s: any) => ({
              subject: s.subject_name,
              marks: Number(s.marks),
            }))
          );
        }
      } catch (err) {
        console.log("Error fetching scholar details", err);
      } finally {
        setLoading(false);
      }
    };

    fetchScholar();
  }, [scholarId, open]);

  // New image uploaded
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));

    setImageChanged(true);
    setImageRemoved(false);
  };

  // Remove current image
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview("");
    setImageRemoved(true);
    setImageChanged(false);
  };

  // Add subject row
  const addSubject = () => {
    setSubjects([...subjects, { subject: "", marks: 0 }]);
  };

  // Remove subject
  const removeSubject = (index: number) => {
    setSubjects(subjects.filter((_, i) => i !== index));
  };

  const validate = () => {
    if (!name.trim()) {
      alert("Name is required");
      return false;
    }

    if (!degree.trim()) {
      alert("Degree is required");
      return false;
    }

    // On create → image is required
    if (!isEditing && !imagePreview && !imageFile) {
      alert("Photo is required");
      return false;
    }

    // At least one subject
    if (subjects.length === 0) {
      alert("Please add at least one top subject");
      return false;
    }

    // Validate each subject row
    for (let i = 0; i < subjects.length; i++) {
      const s = subjects[i];

      if (!s.subject.trim()) {
        alert(`Subject name cannot be empty (Row ${i + 1})`);
        return false;
      }

      if (isNaN(s.marks) || s.marks < 0) {
        alert(`Marks must be a valid number (Row ${i + 1})`);
        return false;
      }
    }

    return true;
  };


  // Save handler
  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      let finalImageUrl = initialImage;

      /** DELETE IMAGE */
      if (isEditing && imageRemoved && initialImage) {
        const path = initialImage.split("/").pop()!;
        await deleteImageFromSupabaseBucket(path);
        finalImageUrl = "";
      }

      /** REPLACE IMAGE */
      if (isEditing && imageChanged && imageFile && initialImage) {
        const path = initialImage.split("/").pop()!;
        await deleteImageFromSupabaseBucket(path);
      }

      /** UPLOAD IMAGE */
      if (imageFile) {
        const { publicUrl } = await uploadImageToSupabaseBucket(imageFile);
        finalImageUrl = publicUrl;
      }

      const payload = {
        name,
        degree,
        image_url: finalImageUrl,
        subjects,
      };

      const method = isEditing ? "PUT" : "POST";
      const url = isEditing
        ? `${host}/api/scholars/${scholarId}`
        : `${host}/api/scholars`;

      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Error saving scholar");

      onSaved();
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      alert("Failed to save scholar.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Scholar" : "Add Scholar"}</DialogTitle>
        </DialogHeader>

        {isEditing && loading ? (
          <p className="py-10 text-center">Loading...</p>
        ) : (
          <div className="space-y-6 py-2">

            {/* IMAGE UPLOAD BLOCK */}
            <div className="flex flex-col items-center gap-3">
              <img
                src={
                  imagePreview
                    ? imagePreview
                    : "/assets/images/placeholder-avatar.svg"
                }
                className="w-24 h-24 rounded-full object-cover border"
                alt="Scholar Preview"
              />

              {!imagePreview ? (
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() =>
                    document.getElementById("scholar-image")?.click()
                  }
                >
                  Upload Photo
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={() =>
                      document.getElementById("scholar-image")?.click()
                    }
                  >
                    Change Photo
                  </Button>
                  <Button variant="destructive" type="button" onClick={handleRemoveImage}>
                    Remove
                  </Button>
                </div>
              )}

              <input
                id="scholar-image"
                type="file"
                accept="image/png,image/jpg,image/jpeg,image/webp"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {/* Fields */}
            <div className="space-y-1">
              <Label>Name</Label>
              <Input
                placeholder="Scholar Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <Label>Degree</Label>
              <Input
                placeholder="Degree"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
              />
            </div>

            {/* SUBJECTS */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Top Subjects</Label>
                <Button size="sm" onClick={addSubject}>
                  + Add Subject
                </Button>
              </div>

              {subjects.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No subjects added
                </p>
              )}

              <div className="space-y-4">
                {subjects.map((row, index) => (
                  <div
                    key={index}
                    className="flex gap-3 items-center border p-3 rounded-md"
                  >
                    <Input
                      className="flex-1"
                      placeholder="Subject"
                      value={row.subject}
                      onChange={(e) => {
                        const updated = [...subjects];
                        updated[index].subject = e.target.value;
                        setSubjects(updated);
                      }}
                    />

                    <Input
                      type="number"
                      className="w-24"
                      placeholder="Marks"
                      value={row.marks}
                      onChange={(e) => {
                        const updated = [...subjects];
                        updated[index].marks = Number(e.target.value);
                        setSubjects(updated);
                      }}
                    />

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => removeSubject(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* SAVE BUTTON */}
            <div className="flex justify-end">
              <Button onClick={handleSubmit} disabled={loading}>
                {loading
                  ? "Saving..."
                  : isEditing
                    ? "Save Changes"
                    : "Add Scholar"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
