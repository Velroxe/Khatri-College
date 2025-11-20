"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CustomModal } from "@/components/CustomModal";
import { Admin } from "@/lib/types";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import AdminForm from "@/components/AdminForm";
import AdminTable from "@/components/AdminTable";

const AdminsPage = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [filteredAdmins, setFilteredAdmins] = useState<Admin[]>([]);
  const [filter, setFilter] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState<{ name: string; email: string } | null>(null);

  const host = process.env.NEXT_PUBLIC_BACKEND;

  // 🔹 Fetch current admin from localStorage
  useEffect(() => {
    const name = localStorage.getItem("admin_name");
    const email = localStorage.getItem("admin_email");
    if (name && email) setCurrentAdmin({ name, email });
  }, []);

  // 🔹 Fetch Admins
  const fetchAdmins = async () => {
    try {
      const res = await fetch(`${host}/api/admins`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch admins");
      const data = await res.json();
      setAdmins(data);
      setFilteredAdmins(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // 🔹 Filter Admins
  useEffect(() => {
    const filtered = admins.filter((a) =>
      a.name.toLowerCase().includes(filter.toLowerCase())
    );
    setFilteredAdmins(filtered);
  }, [filter, admins]);

  // 🔹 Handle Delete
  const handleDelete = async () => {
    if (!selectedAdmin) return;
    try {
      const res = await fetch(`${host}/api/admins/${selectedAdmin.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete admin");
      await fetchAdmins();
      setOpenDelete(false);
      setSelectedAdmin(null);
    } catch (err) {
      console.error(err);
      alert("Error deleting admin");
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* 🔹 Current Admin Info */}
      {currentAdmin && (
        <div className="bg-muted/50 border border-border rounded-lg p-4 shadow-sm">
          <h2 className="text-sm font-semibold mb-1 text-muted-foreground">
            Currently Logged In
          </h2>
          <p className="text-lg font-medium">{currentAdmin.name}</p>
          <p className="text-sm text-muted-foreground">{currentAdmin.email}</p>
        </div>
      )}

      {/* 🔹 Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
        <Input
          placeholder="Filter admins..."
          className="max-w-sm"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <Button
          onClick={() => {
            setSelectedAdmin(null);
            setOpenForm(true);
          }}
        >
          Add New Admin
        </Button>
      </div>

      {/* 🔹 Admins Table */}
      <Card>
        <CardHeader>
          <CardTitle>Admins</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto custom-scrollbar">
          <AdminTable
            admins={filteredAdmins}
            currentAdmin={currentAdmin}
            onEdit={(admin) => {
              setSelectedAdmin(admin);
              setOpenForm(true);
            }}
            onDelete={(admin) => {
              setSelectedAdmin(admin);
              setOpenDelete(true);
            }}
          />
        </CardContent>
      </Card>

      {/* 🔹 Add / Edit Form */}
      <CustomModal
        open={openForm}
        onOpenChange={setOpenForm}
        title={selectedAdmin ? "Edit Admin" : "Add New Admin"}
      >
        <AdminForm
          admin={selectedAdmin}
          host={host!}
          loading={loading}
          setLoading={setLoading}
          onSuccess={() => {
            fetchAdmins();
            setOpenForm(false);
            setSelectedAdmin(null);
          }}
        />
      </CustomModal>

      {/* 🔹 Delete Confirmation */}
      <DeleteConfirmModal
        open={openDelete}
        onOpenChange={setOpenDelete}
        onConfirm={handleDelete}
        title="Delete Admin"
        message={`Are you sure you want to delete "${selectedAdmin?.name}"?`}
      />
    </div>
  );
};

export default AdminsPage;
