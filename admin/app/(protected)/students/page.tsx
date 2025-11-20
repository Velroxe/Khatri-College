"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CustomModal } from "@/components/CustomModal";
import StudentTable from "@/components/StudentTable";
import StudentForm from "@/components/StudentForm";
import { Student } from "@/lib/types";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";

const StudentsPage = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [filter, setFilter] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(false);

  const host = process.env.NEXT_PUBLIC_BACKEND;

  // 🔹 Fetch Students
  const fetchStudents = async () => {
    try {
      const res = await fetch(`${host}/api/students`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch students");
      const data = await res.json();
      setStudents(data);
      setFilteredStudents(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // 🔹 Filter Students
  useEffect(() => {
    const filtered = students.filter((s) =>
      s.name.toLowerCase().includes(filter.toLowerCase())
      || s.email.toLowerCase().includes(filter.toLowerCase())
    );
    setFilteredStudents(filtered);
  }, [filter, students]);

  // 🔹 Handle Delete
  const handleDelete = async () => {
    if (!selectedStudent) return;
    try {
      const res = await fetch(`${host}/api/students/${selectedStudent.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete student");
      await fetchStudents();
      setOpenDelete(false);
      setSelectedStudent(null);
    } catch (err) {
      console.error(err);
      alert("Error deleting student");
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* 🔹 Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
        <Input
          placeholder="Filter students..."
          className="max-w-sm"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <Button
          className="cursor-pointer"
          onClick={() => {
            setSelectedStudent(null);
            setOpenForm(true);
          }}
        >
          Add New Student
        </Button>
      </div>

      {/* 🔹 Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>Students</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto custom-scrollbar">
          <StudentTable
            students={filteredStudents}
            onEdit={(student) => {
              setSelectedStudent(student);
              setOpenForm(true);
            }}
            onDelete={(student) => {
              setSelectedStudent(student);
              setOpenDelete(true);
            }}
          />
        </CardContent>
      </Card>

      {/* 🔹 Add / Edit Form */}
      <CustomModal
        open={openForm}
        onOpenChange={setOpenForm}
        title={selectedStudent ? "Edit Student" : "Add New Student"}
      >
        <StudentForm
          student={selectedStudent}
          host={host!}
          loading={loading}
          setLoading={setLoading}
          onSuccess={() => {
            fetchStudents();
            setOpenForm(false);
            setSelectedStudent(null);
          }}
        />
      </CustomModal>

      {/* 🔹 Delete Confirmation */}
      <DeleteConfirmModal
        open={openDelete}
        onOpenChange={setOpenDelete}
        onConfirm={handleDelete}
        title="Delete Student"
        message={`Are you sure you want to delete "${selectedStudent?.name}"?`}
      />
    </div>
  );
};

export default StudentsPage;
