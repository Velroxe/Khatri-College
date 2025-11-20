"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CustomModal } from "@/components/CustomModal";
import { uploadImageToSupabaseBucket, deleteImageFromSupabaseBucket } from "@/lib/supabaseUploadUtils";
import { Faculty } from "@/lib/types";

export function AddOrEditFacultyModal({
  open,
  onOpenChange,
  onSaved,
  faculty, // if null => Add, if exists => Edit
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSaved: () => void;
  faculty: Faculty | null;
}) {
  const isEdit = !!faculty;

  const [form, setForm] = useState({
    name: "",
    qualifications: "",
    description: "",
    specialities: "",
    experience_years: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [initialImage, setInitialImage] = useState<string>(""); // store original image

  const [imageRemoved, setImageRemoved] = useState(false); // true when user clicked remove
  const [imageChanged, setImageChanged] = useState(false); // true when the user selects a new file

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const host = process.env.NEXT_PUBLIC_BACKEND;

  // Load form data when editing
  useEffect(() => {
    if (isEdit && faculty) {
      setForm({
        name: faculty.name,
        qualifications: faculty.qualifications,
        description: faculty.description,
        specialities: faculty.specialities,
        experience_years: faculty.experience_years.toString(),
      });

      setImagePreview(faculty.image_url || "");
      setInitialImage(faculty.image_url || "");

      setImageRemoved(false);
      setImageChanged(false);
      setImageFile(null);
    } else {
      // reset for add
      setForm({
        name: "",
        qualifications: "",
        description: "",
        specialities: "",
        experience_years: "",
      });

      setImageFile(null);
      setImagePreview("");
      setInitialImage("");
      setImageRemoved(false);
      setImageChanged(false);
    }
  }, [faculty, open]);

  // Form change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // New image selected
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setImageFile(selected);
    setImagePreview(URL.createObjectURL(selected));
    setImageChanged(true);
    setImageRemoved(false);
  };

  // Remove image
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview("");
    setImageRemoved(true);
    setImageChanged(false);
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.qualifications || !form.specialities) {
      return setError("Please fill all required fields.");
    }

    try {
      setLoading(true);

      let finalImageUrl = initialImage;

      /** -------------------------
       *  HANDLE IMAGE DELETION
       * ------------------------- */

      // CASE 1 → user removed image
      if (isEdit && imageRemoved && initialImage) {
        const path = initialImage.split("/").pop() || "";
        await deleteImageFromSupabaseBucket(path);
        finalImageUrl = ""; // save empty image
      }

      // CASE 2 → user uploaded a new image
      if (isEdit && imageChanged && imageFile && initialImage) {
        const path = initialImage.split("/").pop() || "";
        await deleteImageFromSupabaseBucket(path);
      }

      /** -------------------------
       *  HANDLE IMAGE UPLOAD
       * ------------------------- */

      // If new file uploaded → upload to Supabase
      if (imageFile) {
        const { publicUrl } = await uploadImageToSupabaseBucket(imageFile);
        finalImageUrl = publicUrl;
      }

      /** -------------------------
       *  API CALL
       * ------------------------- */

      const payload = {
        ...form,
        image_url: finalImageUrl || "",
        experience_years: Number(form.experience_years) || 0,
      };

      const method = isEdit ? "PUT" : "POST";
      const url = isEdit
        ? `${host}/api/faculties/${faculty?.id}`
        : `${host}/api/faculties`;

      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save faculty");

      onSaved();
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      setError("Error saving faculty.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomModal
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Edit Faculty" : "Add Faculty"}
      className="custom-scrollbar"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pb-2">
        {/* IMAGE UPLOAD BLOCK */}
        <div className="flex flex-col items-center gap-3">
          <img
            src={
              imagePreview
                ? imagePreview
                : "/assets/images/placeholder-avatar.svg"
            }
            className="w-24 h-24 rounded-full object-cover border"
            alt="Faculty Preview"
          />

          {!imagePreview ? (
            <Button
              variant="secondary"
              type="button"
              onClick={() => document.getElementById("faculty-image")?.click()}
            >
              Upload Photo
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="secondary"
                type="button"
                onClick={() => document.getElementById("faculty-image")?.click()}
              >
                Change Photo
              </Button>
              <Button
                variant="destructive"
                type="button"
                onClick={handleRemoveImage}
              >
                Remove
              </Button>
            </div>
          )}

          <input
            id="faculty-image"
            type="file"
            accept="image/jpg,image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        <Input
          placeholder="Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <Input
          placeholder="Qualification(s) (comma separated)"
          name="qualifications"
          value={form.qualifications}
          onChange={handleChange}
        />
        <Input
          placeholder="Specialities (comma separated)"
          name="specialities"
          value={form.specialities}
          onChange={handleChange}
        />
        <Textarea
          placeholder="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
        />
        <Input
          type="number"
          placeholder="Experience (in years)"
          name="experience_years"
          value={form.experience_years}
          onChange={handleChange}
        />

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : isEdit ? "Update" : "Save"}
          </Button>
        </div>
      </form>
    </CustomModal>
  );
}
