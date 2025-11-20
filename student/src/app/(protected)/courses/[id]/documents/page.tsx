"use client"

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { DocumentType } from "@/lib/types";

const host = process.env.NEXT_PUBLIC_BACKEND;

const DocumentsInCourse = () => {
  const { id } = useParams(); // courseId
  const [courseName, setCourseName] = useState("");
  const [documents, setDocuments] = useState<DocumentType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDocuments() {
      try {
        const res = await fetch(`${host}/api/students/courses/${id}/documents`, {
          credentials: "include",
        });

        const data = await res.json();
        if (!res.ok) {
          console.error("Error fetching:", data);
          return;
        }

        setCourseName(data.course);
        setDocuments(data.documents || []);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchDocuments();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="animate-spin w-6 h-6" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <Card className="shadow-md rounded-xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Documents in {courseName}
          </CardTitle>
        </CardHeader>

        <CardContent>
          {documents.length === 0 ? (
            <p className="text-muted-foreground">No documents uploaded yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File Name</TableHead>
                  <TableHead>Uploaded At</TableHead>
                  <TableHead>Public URL</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {documents.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">{doc.name}</TableCell>

                    <TableCell>
                      {new Date(doc.created_at).toLocaleString()}
                    </TableCell>

                    <TableCell>
                      <a
                        href={doc.public_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        View File
                      </a>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentsInCourse;
