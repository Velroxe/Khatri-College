"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Course } from "@/lib/types";
import Link from "next/link";

const CourseDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const host = process.env.NEXT_PUBLIC_BACKEND;

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(`${host}/api/courses/${id}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch course details");
        const data = await res.json();
        setCourse(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchCourse();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-muted-foreground">
        Loading course details...
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-muted-foreground mb-4">Course not found.</p>
        <Button onClick={() => router.push("/courses")}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <CardTitle className="text-2xl font-semibold">
              {course.name}
            </CardTitle>

            <div
              className={`px-3 py-1 w-fit rounded-full text-sm font-medium ${course.status === "ongoing"
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                  : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                }`}
            >
              {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div>
            <h2 className="text-sm font-medium text-muted-foreground mb-1">
              Description
            </h2>
            <p className="text-base overflow-x-auto leading-relaxed">{course.description}</p>
          </div>

          <Separator />

          <div>
            <h2 className="text-sm font-medium text-muted-foreground mb-1">
              Created At
            </h2>
            <p className="text-base">
              {new Date(course.created_at).toLocaleString()}
            </p>
          </div>

          <Separator />

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Link
              href={`/courses/${course.id}/students`}
            >
              <Button
                className="cursor-pointer flex-1"
                variant="outline"
              >
                Students in this Course
              </Button>
            </Link>

            <Link
              href={`/courses/${course.id}/documents`}
            >
              <Button
                className="cursor-pointer flex-1"
              >
                Documents in this Course
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseDetailPage;
