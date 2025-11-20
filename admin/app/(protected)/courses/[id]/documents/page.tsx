"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { AddDocumentModal } from "./components/AddDocumentModal";
import { DocumentsTable } from "./components/DocumentsTable";

export default function DocumentsInCourse() {
  const { id } = useParams();
  const [courseName, setCourseName] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [refreshFlag, setRefreshFlag] = useState(false); // 👈 NEW

  const host = process.env.NEXT_PUBLIC_BACKEND;

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(`${host}/api/courses/${id}`, {
          credentials: "include",
        });
        const data = await res.json();
        setCourseName(data.name);
      } catch (err) {
        console.error("Error fetching course:", err);
      }
    };
    fetchCourse();
  }, [id]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">
          Documents in <span className="text-primary">"{courseName}"</span> course
        </h1>
        <Button onClick={() => setOpenModal(true)}>Add Document</Button>
      </div>

      {/* Pass refreshFlag to rerender */}
      <DocumentsTable courseId={id as string} refreshFlag={refreshFlag} />

      <AddDocumentModal
        open={openModal}
        onOpenChange={setOpenModal}
        courseId={id as string}
        onAdded={() => setRefreshFlag((p) => !p)} // 👈 Trigger refresh
      />
    </div>
  );
}
