"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CustomModal } from "@/components/CustomModal";
import { uploadFileToDrive } from "@/lib/googleDriveUtils";

export function AddDocumentModal({
  open,
  onOpenChange,
  courseId,
  onAdded, // 👈 NEW PROP
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseId: string;
  onAdded: () => void; // 👈 TYPE
}) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const host = process.env.NEXT_PUBLIC_BACKEND;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    const selected = e.target.files?.[0];

    if (!selected) {
      setError("Please select a file.");
      return;
    }

    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
    if (!allowedTypes.includes(selected.type)) {
      setError("File must be a PDF or image.");
      return;
    }

    if (selected.size > 5 * 1024 * 1024) {
      setError("File size must not exceed 5 MB.");
      return;
    }

    setFile(selected);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return setError("No file selected.");
    setUploading(true);
    try {
      const { fileId, publicUrl } = await uploadFileToDrive(file);
      const res = await fetch(`${host}/api/documents`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: file.name,
          public_file_id: fileId,
          public_url: publicUrl,
          course_id: courseId,
        }),
      });
      if (!res.ok) throw new Error("Failed to create document");

      onOpenChange(false);
      onAdded(); // 👈 Trigger re-fetch in parent
    } catch (err) {
      console.error(err);
      setError("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <CustomModal open={open} onOpenChange={onOpenChange} title="Add Document">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} />
        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={uploading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={uploading}>
            {uploading ? "Uploading..." : "Upload"}
          </Button>
        </div>
      </form>
    </CustomModal>
  );
}
