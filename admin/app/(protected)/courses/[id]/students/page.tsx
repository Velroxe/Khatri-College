"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CustomModal } from "@/components/CustomModal";
import StudentsTable from "./StudentsTable";
import ManageStudentsModal from "./ManageStudentsModal";
import { Course, Student } from "@/lib/types";

export default function StudentsInCoursePage() {
  const { id } = useParams();
  const host = process.env.NEXT_PUBLIC_BACKEND;
  const [course, setCourse] = useState<Course | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [removeModalOpen, setRemoveModalOpen] = useState(false);
  const [manageModalOpen, setManageModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // 🔹 Fetch Course & Students
  const fetchData = async () => {
    try {
      const res = await fetch(`${host}/api/courses/${id}/students`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setCourse(data.course);
      setStudents(data.students);
      setFilteredStudents(data.students);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  // 🔹 Filter students
  useEffect(() => {
    const f = students.filter((s) =>
      s.name.toLowerCase().includes(filter.toLowerCase())
      || s.email.toLowerCase().includes(filter.toLowerCase())
    );
    setFilteredStudents(f);
  }, [filter, students]);

  // 🔹 Remove student
  const handleRemoveStudent = async () => {
    if (!selectedStudent) return;
    try {
      const res = await fetch(
        `${host}/api/courses/${id}/students/${selectedStudent.id}`,
        { method: "DELETE", credentials: "include" }
      );
      if (!res.ok) throw new Error("Failed");
      setStudents((prev) =>
        prev.filter((s) => s.id !== selectedStudent.id)
      );
      setRemoveModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-muted-foreground">
        Loading students...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* 🔹 Heading Section */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <h1 className="text-2xl font-semibold">
          Students in "{course?.name || "Course"}"
        </h1>
        <div className="flex items-center gap-3">
          <p className="text-muted-foreground text-nowrap">
            Total: {students.length}
          </p>
          <Button onClick={() => setManageModalOpen(true)}>
            Manage Students
          </Button>
        </div>
      </div>

      {/* 🔹 Filter Input */}
      <div className="max-w-sm">
        <Input
          placeholder="Filter students..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      {/* 🔹 Table */}
      <Card>
        <CardHeader>
          <CardTitle>Enrolled Students</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto custom-scrollbar">
          <StudentsTable
            students={filteredStudents}
            onRemoveClick={(s) => {
              setSelectedStudent(s);
              setRemoveModalOpen(true);
            }}
          />
        </CardContent>
      </Card>

      {/* 🔹 Remove Confirmation Modal */}
      <CustomModal
        open={removeModalOpen}
        onOpenChange={setRemoveModalOpen}
        title="Confirm Removal"
      >
        <p className="text-sm mb-4">
          Are you sure you want to remove{" "}
          <span className="font-medium">
            {selectedStudent?.name}
          </span>{" "}
          from this course?
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setRemoveModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleRemoveStudent}>
            Confirm
          </Button>
        </div>
      </CustomModal>

      {/* 🔹 Manage Students Modal */}
      <ManageStudentsModal
        open={manageModalOpen}
        onOpenChange={setManageModalOpen}
        courseId={id as string}
        currentStudents={students}
        onUpdated={() => fetchData()}
      />
    </div>
  );
}
