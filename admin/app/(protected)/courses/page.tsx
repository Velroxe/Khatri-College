"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CustomModal } from "@/components/CustomModal";
import CourseTable from "@/components/CourseTable";
import CourseForm from "@/components/CourseForm";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import { Course } from "@/lib/types";


export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [filter, setFilter] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(false);

  const host = process.env.NEXT_PUBLIC_BACKEND;

  // Fetch courses
  const fetchCourses = async () => {
    try {
      const res = await fetch(`${host}/api/courses`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch courses");
      const data = await res.json();
      setCourses(data);
      setFilteredCourses(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Filter
  useEffect(() => {
    const filtered = courses.filter((c) =>
      c.name.toLowerCase().includes(filter.toLowerCase())
      || c.description?.toLowerCase().includes(filter.toLowerCase())
    );
    setFilteredCourses(filtered);
  }, [filter, courses]);

  // Handle Delete
  const handleDelete = async () => {
    if (!selectedCourse) return;
    try {
      const res = await fetch(`${host}/api/courses/${selectedCourse.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete");
      await fetchCourses();
      setOpenDelete(false);
      setSelectedCourse(null);
    } catch (err) {
      console.error(err);
      alert("Error deleting course");
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* 🔹 Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
        <Input
          placeholder="Filter courses..."
          className="max-w-sm"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <Button
          className="cursor-pointer"
          onClick={() => {
            setSelectedCourse(null);
            setOpenForm(true);
          }}
        >
          Add New Course
        </Button>
      </div>

      {/* 🔹 Table */}
      <Card>
        <CardHeader>
          <CardTitle>Courses</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto custom-scrollbar">
          <CourseTable
            courses={filteredCourses}
            onEdit={(course) => {
              setSelectedCourse(course);
              setOpenForm(true);
            }}
            onDelete={(course) => {
              setSelectedCourse(course);
              setOpenDelete(true);
            }}
          />
        </CardContent>
      </Card>

      {/* 🔹 Form Modal */}
      <CustomModal
        open={openForm}
        onOpenChange={setOpenForm}
        title={selectedCourse ? "Edit Course" : "Add New Course"}
      >
        <CourseForm
          course={selectedCourse}
          host={host!}
          loading={loading}
          setLoading={setLoading}
          onSuccess={() => {
            fetchCourses();
            setOpenForm(false);
            setSelectedCourse(null);
          }}
        />
      </CustomModal>

      {/* 🔹 Delete Confirmation Modal */}
      <DeleteConfirmModal
        open={openDelete}
        onOpenChange={setOpenDelete}
        onConfirm={handleDelete}
        title="Delete Course"
        message={`Are you sure you want to delete "${selectedCourse?.name}"?`}
      />
    </div>
  );
}
