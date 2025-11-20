"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Student } from "@/lib/types";
import { StudentInfoCard } from "./components/StudentInfoCard";
import { StudentCoursesTable } from "./components/StudentCoursesTable";

export default function StudentDetailsPage() {
  const { id } = useParams();
  const host = process.env.NEXT_PUBLIC_BACKEND;
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch student details
  const fetchStudent = async () => {
    try {
      const res = await fetch(`${host}/api/students/${id}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch student");
      const data = await res.json();
      setStudent(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudent();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh] text-muted-foreground">
        Loading student details...
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex justify-center items-center h-[70vh] text-destructive">
        Student not found
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <StudentInfoCard student={student} />
      <StudentCoursesTable studentId={student.id} />
    </div>
  );
}
