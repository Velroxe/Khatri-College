"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Course } from "@/lib/types";
import { useRouter } from "next/navigation";

const host = process.env.NEXT_PUBLIC_BACKEND;

const CoursesPage = () => {

  const router = useRouter();

  const [student, setStudent] = useState(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const studentId = localStorage.getItem("student_id");
        if (!studentId) return;

        const res = await fetch(`${host}/api/students/${studentId}/mycourses`, {
          credentials: "include",
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.message);

        setStudent(data.student);
        setCourses(data.courses);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">My Courses</h1>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : courses.length === 0 ? (
        <p className="text-muted-foreground">You are not enrolled in any courses.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card 
              key={course.id} 
              className="shadow-sm hover:shadow-md transition cursor-pointer"
              onClick={() => router.push(`/courses/${course.id}`)}
            >
              <CardHeader>
                <CardTitle className="text-xl">{course.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  {
                    !course.description ? "No description"
                    : course.description?.length > 30 ? course.description.slice(0, 30)
                    : course.description
                  }
                </p>
                <p className="text-sm font-medium">
                  Enrolled at: <span className="font-normal">{new Date(course.enrolled_at).toLocaleString()}</span>
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CoursesPage;
