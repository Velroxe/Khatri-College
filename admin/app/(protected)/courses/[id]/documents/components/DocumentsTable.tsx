"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { CustomModal } from "@/components/CustomModal";
import { DocumentType } from "@/lib/types";
import { deleteFileFromDrive } from "@/lib/googleDriveUtils";
import Link from "next/link";

export function DocumentsTable({
  courseId,
  refreshFlag, // 👈 NEW PROP
}: {
  courseId: string;
  refreshFlag: boolean;
}) {
  const [documents, setDocuments] = useState<DocumentType[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<DocumentType | null>(null);
  const host = process.env.NEXT_PUBLIC_BACKEND;

  const fetchDocuments = async () => {
    try {
      const res = await fetch(`${host}/api/courses/${courseId}/documents`, {
        credentials: "include",
      });
      const data = await res.json();
      setDocuments(data.documents);
    } catch (err) {
      console.error("Failed to fetch documents", err);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [courseId, refreshFlag]); // 👈 Re-fetch when refreshFlag toggles

  const handleDelete = async (id: string) => {
    try {
      await deleteFileFromDrive(id);
      const res = await fetch(`${host}/api/documents/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete document");
      fetchDocuments();
      setSelectedDoc(null);
    } catch (err) {
      console.error(err);
      alert("Failed to delete document");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Documents List</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto custom-scrollbar">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Uploaded At</TableHead>
              <TableHead>Public URL</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.length > 0 ? (
              documents.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>
                    {
                      doc?.name?.length > 50
                        ? doc?.name?.slice(0, 50) + "..."
                        : doc?.name
                    }
                  </TableCell>
                  <TableCell>{new Date(doc.created_at).toLocaleString()}</TableCell>
                  <TableCell>
                    <Link
                      href={doc.public_url}
                      target="_blank"
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </Link>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setSelectedDoc(doc)}
                      className="cursor-pointer"
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-muted-foreground"
                >
                  No documents found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>

      <CustomModal
        open={!!selectedDoc}
        onOpenChange={() => setSelectedDoc(null)}
        title="Confirm Delete"
      >
        <p className="text-sm text-muted-foreground mb-4">
          Are you sure you want to delete{" "}
          <span className="font-semibold">{selectedDoc?.name}</span>?
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setSelectedDoc(null)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => handleDelete(selectedDoc!.public_file_id)}
          >
            Delete
          </Button>
        </div>
      </CustomModal>
    </Card>
  );
}
