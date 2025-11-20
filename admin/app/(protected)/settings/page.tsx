"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CustomModal } from "@/components/CustomModal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// -------------------------------
// Cleanup Section Component
// -------------------------------
function CleanupSection() {
  const host = process.env.NEXT_PUBLIC_BACKEND;
  const [loading, setLoading] = useState(false);
  const [successDialog, setSuccessDialog] = useState(false);
  const [error, setError] = useState("");

  const handleCleanup = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${host}/api/cleanup`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Cleanup failed");
      }

      setSuccessDialog(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h2 className="text-lg font-medium">Cleanup</h2>
      <p className="text-sm text-muted-foreground">
        This will delete **old OTPs and refresh tokens** to free up database space.
      </p>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button variant="destructive" onClick={handleCleanup} disabled={loading}>
        {loading ? "Cleaning..." : "Run Cleanup"}
      </Button>

      {/* Success Dialog */}
      <Dialog open={successDialog} onOpenChange={setSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cleanup Completed 🧹</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">
            Old OTPs and refresh tokens have been deleted successfully.
          </p>
          <div className="flex justify-end pt-4">
            <Button onClick={() => setSuccessDialog(false)}>Okay</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// -------------------------------
// Main Page Component
// -------------------------------
export default function SettingsPage() {
  const [openChangeModal, setOpenChangeModal] = useState(false);
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false);

  const host = process.env.NEXT_PUBLIC_BACKEND;

  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.oldPassword || !form.newPassword || !form.confirmNewPassword) {
      return setError("All fields are required.");
    }

    if (form.newPassword !== form.confirmNewPassword) {
      return setError("New passwords do not match.");
    }

    try {
      setLoading(true);
      const res = await fetch(`${host}/api/auth/admin/change-password`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          oldPassword: form.oldPassword,
          newPassword: form.newPassword,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to change password");
      }

      setOpenChangeModal(false);
      setForm({ oldPassword: "", newPassword: "", confirmNewPassword: "" });
      setOpenSuccessDialog(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-10">
      <h1 className="text-2xl font-semibold">Settings</h1>

      {/* ---------------- Password Section ---------------- */}
      <section className="space-y-4 p-4 border rounded-lg">
        <h2 className="text-lg font-medium">Change Password</h2>
        <Button onClick={() => setOpenChangeModal(true)}>Change Password</Button>
      </section>

      {/* ---------------- Cleanup Section ---------------- */}
      <CleanupSection />

      {/* Change Password Modal */}
      <CustomModal
        open={openChangeModal}
        onOpenChange={setOpenChangeModal}
        title="Change Password"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="oldPassword">Old Password</Label>
            <Input
              id="oldPassword"
              name="oldPassword"
              type="password"
              value={form.oldPassword}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              name="newPassword"
              type="password"
              value={form.newPassword}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
            <Input
              id="confirmNewPassword"
              name="confirmNewPassword"
              type="password"
              value={form.confirmNewPassword}
              onChange={handleChange}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpenChangeModal(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </CustomModal>

      {/* Success Dialog */}
      <Dialog open={openSuccessDialog} onOpenChange={setOpenSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Password Changed ✅</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">
            Your password has been successfully updated.
          </p>
          <div className="flex justify-end pt-4">
            <Button onClick={() => setOpenSuccessDialog(false)}>Okay</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
