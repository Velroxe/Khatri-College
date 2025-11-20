"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Input } from "@/components/ui/input";
import { AddOrEditFacultyModal } from "./AddOrEditFacultyModal";
import { Faculty } from "@/lib/types";
import { deleteImageFromSupabaseBucket } from "@/lib/supabaseUploadUtils";
import { useRouter } from "next/navigation";

export function FacultiesTable() {

  const router = useRouter();

  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [filteredFaculties, setFilteredFaculties] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);

  const host = process.env.NEXT_PUBLIC_BACKEND;

  // Fetch faculties
  const fetchFaculties = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${host}/api/faculties`, {
        credentials: "include",
      });

      const data = await res.json();
      setFaculties(data);
      setFilteredFaculties(data);
    } catch (err) {
      console.error("Failed to fetch faculties", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaculties();
  }, []);

  // Filter whenever search text changes
  useEffect(() => {
    const q = search.toLowerCase();

    const filtered = faculties.filter((f) => {
      return (
        f.name.toLowerCase().includes(q) ||
        f.qualifications.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q) ||
        f.specialities.toLowerCase().includes(q)
      );
    });

    setFilteredFaculties(filtered);
  }, [search, faculties]);

  // Delete faculty
  const handleDelete = async (f: Faculty) => {
    const confirmed = window.confirm("Are you sure you want to delete?");
    if (!confirmed) return;

    try {
      const path = f.image_url.split("/").pop();
      await deleteImageFromSupabaseBucket(path);

      const res = await fetch(`${host}/api/faculties/${f.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to delete");

      fetchFaculties();
    } catch (err) {
      console.error(err);
      alert("Failed to delete faculty");
    }
  };

  return (
    <>
      {/* SEARCH INPUT */}
      <div className="mb-4 max-w-96">
        <Input
          placeholder="Search by name, qualifications, description, specialities..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="w-full overflow-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Photo</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredFaculties.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6">
                  No faculties found.
                </TableCell>
              </TableRow>
            ) : (
              filteredFaculties.map((f) => (
                <TableRow 
                  key={f.id}
                  className="cursor-pointer"
                  onClick={() => router.push(`/faculties/${f.id}`)}
                >
                  <TableCell>
                    <img
                      src={
                        f.image_url ||
                        "/assets/images/placeholder-avatar.svg"
                      }
                      className="w-10 h-10 rounded-full object-cover border"
                      alt="Faculty"
                    />
                  </TableCell>

                  <TableCell className="font-medium">{f.name}</TableCell>

                  <TableCell>
                    {new Date(f.created_at).toLocaleString()}
                  </TableCell>

                  <TableCell className="text-center space-x-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={(event) => {
                        event.stopPropagation();
                        setSelectedFaculty(f);
                        setModalOpen(true);
                      }}
                    >
                      Edit
                    </Button>

                    <Button
                      size="sm"
                      variant="destructive"
                      className="cursor-pointer"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleDelete(f);
                      }}
                    >
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add / Edit Modal */}
      <AddOrEditFacultyModal
        open={modalOpen}
        onOpenChange={(v) => {
          setModalOpen(v);
          if (!v) setSelectedFaculty(null);
        }}
        faculty={selectedFaculty}
        onSaved={() => {
          fetchFaculties();
        }}
      />
    </>
  );
}
