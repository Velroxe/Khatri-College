"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Course } from "@/lib/types";
import { useRouter } from "next/navigation";

interface Props {
  courses: Course[];
  onEdit: (course: Course) => void;
  onDelete: (course: Course) => void;
}

export default function CourseTable({ courses, onEdit, onDelete }: Props) {
  const router = useRouter();
  return (
    <div className="table-container">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="w-[120px]">Status</TableHead>
            <TableHead className="w-[150px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.length > 0 ? (
            courses.map((course) => (
              <TableRow key={course.id} className="cursor-pointer" onClick={() => { router.push(`/courses/${course.id}`) }}>
                <TableCell className="font-medium">{course.name?.length > 20 ? course.name.slice(0, 20) + "..." : course.name}</TableCell>
                <TableCell>{course.description?.length > 20 ? course.description.slice(0, 20) + "..." : course.description}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${course.status === "ongoing"
                      ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200"
                      : "bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200"
                      }`}
                  >
                    {course.status}
                  </span>
                </TableCell>
                <TableCell className="flex justify-end gap-2">
                  <Button
                    className="cursor-pointer"
                    size="sm"
                    variant="outline"
                    onClick={(event) => {
                      event.stopPropagation();
                      onEdit(course);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    className="cursor-pointer"
                    size="sm"
                    variant="destructive"
                    onClick={(event) => {
                      event.stopPropagation();
                      onDelete(course);
                    }}
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
                className="text-center text-sm text-muted-foreground"
              >
                No courses found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
