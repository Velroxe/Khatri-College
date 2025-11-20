"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Course } from "@/lib/types";
import { useRouter } from "next/navigation";

export function StudentCoursesTable({ studentId }: { studentId: string | number }) {
  const host = process.env.NEXT_PUBLIC_BACKEND;
  const [courses, setCourses] = useState<Course[]>([]);
  const [filter, setFilter] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const router = useRouter();

  const fetchCourses = async () => {
    try {
      const res = await fetch(`${host}/api/students/${studentId}/courses`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch courses");
      const data = await res.json();
      console.log(data);
      console.log(data.courses);
      setCourses(data?.courses);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [studentId]);

  const handleRemove = async (courseId: string | number) => {
    try {
      const res = await fetch(`${host}/api/courses/${courseId}/students/${studentId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to remove course");
      fetchCourses();
      setSelectedCourse(null);
    } catch (err) {
      console.error(err);
      alert("Failed to remove student from course");
    }
  };

  const filteredCourses = courses.filter((course) =>
    course.name.toLowerCase().includes(filter.toLowerCase())
    || course?.description?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between gap-3">
          <CardTitle>Enrolled Courses</CardTitle>
          <Input
            placeholder="Filter courses..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="max-w-xs"
          />
        </div>
      </CardHeader>
      <CardContent className="overflow-x-auto custom-scrollbar">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Course Name</TableHead>
              <TableHead>Enrolled At</TableHead>
              <TableHead className="w-[100px] text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course) => (
                <TableRow 
                  key={course.id}
                  onClick={() => router.push(`/courses/${course.id}`)}
                  className="cursor-pointer"
                >
                  <TableCell className="font-medium">{course.name}</TableCell>
                  <TableCell>
                    {new Date(course.enrolled_at).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      className="cursor-pointer"
                      variant="destructive"
                      size="sm"
                      onClick={(event) => {
                        event.stopPropagation();
                        setSelectedCourse(course);
                      }}
                    >
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-sm text-muted-foreground">
                  No courses found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>

      {/* Remove Confirmation Modal */}
      <CustomModal
        open={!!selectedCourse}
        onOpenChange={() => setSelectedCourse(null)}
        title="Confirm Removal"
      >
        <p className="text-sm text-muted-foreground mb-4">
          Are you sure you want to remove the student from{" "}
          <span className="font-medium">{selectedCourse?.name}</span>?
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setSelectedCourse(null)}>
            Cancel
          </Button>
          <Button
            className="cursor-pointer"
            variant="destructive"
            onClick={() => handleRemove(selectedCourse!.id)}
          >
            Confirm
          </Button>
        </div>
      </CustomModal>
    </Card>
  );
}
