"use client";
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter, useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Course } from "@/lib/types";
import Link from "next/link";

const host = process.env.NEXT_PUBLIC_BACKEND;

const CourseDetailsPage = () => {
  const router = useRouter();
  const { id } = useParams(); // course ID from URL

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchCourse = async () => {
      try {
        const res = await fetch(`${host}/api/students/courses/${id}`, {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();

        if (!res.ok) {
          console.error(data);
          return;
        }

        setCourse(data.course);
      } catch (err) {
        console.error("Error fetching course details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  if (loading) {
    return (
      <div className="w-full flex justify-center mt-10">
        <Loader2 className="animate-spin h-8 w-8 text-muted-foreground" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center mt-10 text-red-500 font-medium">
        Failed to load course details.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <Card className="shadow-sm border rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{course.name}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {course.description || "No description available."}
          </p>
        </CardHeader>

        <CardContent className="space-y-4 mt-2">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Enrolled At</p>
              <p className="font-medium">
                {course.enrolled_at
                  ? new Date(course.enrolled_at).toLocaleString()
                  : "—"}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="font-medium capitalize">
                {course.status || "ongoing"}
              </p>
            </div>
          </div>

          <Link
            href={`/courses/${id}/documents`}
          >
            <Button
              className="w-full mt-4"
            >
              Documents in this Course
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseDetailsPage;
