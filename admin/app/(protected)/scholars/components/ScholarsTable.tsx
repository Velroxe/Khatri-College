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

import { ScholarModal } from "./ScholarModal";
import { Scholar } from "@/lib/types";
import { deleteImageFromSupabaseBucket } from "@/lib/supabaseUploadUtils";

export function ScholarsTable() {
  const [scholars, setScholars] = useState<Scholar[]>([]);
  const [filtered, setFiltered] = useState<Scholar[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchText, setSearchText] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedScholarId, setSelectedScholarId] = useState<string | null>(null);

  const host = process.env.NEXT_PUBLIC_BACKEND;

  // Fetch scholars
  const fetchScholars = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${host}/api/scholars`, {
        credentials: "include",
      });

      const data = await res.json();
      setScholars(data);
      setFiltered(data);
    } catch (err) {
      console.error("Failed to fetch scholars", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScholars();
  }, []);

  // Search filter
  useEffect(() => {
    if (!searchText.trim()) {
      setFiltered(scholars);
      return;
    }

    const text = searchText.toLowerCase();

    const results = scholars.filter((s) => {
      const subjects = s.subjects
        ?.map((x) => `${x.subject} ${x.marks}`)
        .join(" ")
        .toLowerCase();

      return (
        s.name.toLowerCase().includes(text) ||
        s.degree.toLowerCase().includes(text) ||
        subjects.includes(text)
      );
    });

    setFiltered(results);
  }, [searchText, scholars]);

  // Delete
  const handleDelete = async (sch: Scholar) => {
    const confirmed = window.confirm("Are you sure you want to delete?");
    if (!confirmed) return;

    try {
      const path = sch.image_url?.split("/").pop();
      await deleteImageFromSupabaseBucket(path);

      const res = await fetch(`${host}/api/scholars/${sch.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to delete");

      fetchScholars();
    } catch (err) {
      console.error(err);
      alert("Failed to delete scholar");
    }
  };

  return (
    <>
      {/* SEARCH BAR */}
      <div className="flex justify-between mb-4">
        <Input
          placeholder="Search scholars..."
          className="max-w-xs"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        <Button
          onClick={() => {
            setSelectedScholarId(null);
            setModalOpen(true);
          }}
        >
          Add Scholar
        </Button>
      </div>

      {/* TABLE */}
      <div className="w-full overflow-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Photo</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Degree</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
                  No scholars found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>
                    <img
                      src={
                        s.image_url || "/assets/images/placeholder-avatar.svg"
                      }
                      className="w-10 h-10 rounded-full object-cover border"
                      alt="Scholar"
                    />
                  </TableCell>

                  <TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell>{s.degree}</TableCell>

                  <TableCell>
                    {new Date(s.created_at).toLocaleDateString()}
                  </TableCell>

                  <TableCell className="text-center space-x-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        setSelectedScholarId(s.id);
                        setModalOpen(true);
                      }}
                    >
                      Edit
                    </Button>

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(s)}
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

      {/* MODAL */}
      <ScholarModal
        open={modalOpen}
        onOpenChange={(v) => {
          setModalOpen(v);
          if (!v) setSelectedScholarId(null);
        }}
        scholarId={selectedScholarId}
        onSaved={() => fetchScholars()}
      />
    </>
  );
}
