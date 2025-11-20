"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Course, Student } from "@/lib/types";

const host = process.env.NEXT_PUBLIC_BACKEND;

interface DashboardResponse {
  message: string;
  student: Student;
  totalCourses: number;
  courses: Course[];
}

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await fetch(`${host}/api/dashboard/students`, {
        credentials: "include"
      });
      const data = await res.json();

      if (!res.ok) {
        console.error(data);
        return;
      }

      setDashboard(data);
      setLoading(false);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-lg">
        Loading dashboard...
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-lg">
        Failed to load dashboard.
      </div>
    );
  }

  const { student, totalCourses, courses } = dashboard;

  return (
    <div className="p-8 space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {student.name}! Here is your academic overview.
        </p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* PROFILE CARD */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
            <CardDescription>Account & status details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p><span className="font-medium">Name:</span> {student.name}</p>
            <p><span className="font-medium">Email:</span> {student.email}</p>

            <div className="flex items-center gap-2">
              <span className="font-medium">Status:</span>
              <Badge variant={student.status === "active" ? "default" : "destructive"}>
                {student.status}
              </Badge>
            </div>

            <Separator />

            <p>
              <span className="font-medium">Joined:</span>{" "}
              {new Date(student.created_at).toLocaleDateString()}
            </p>

            <p>
              <span className="font-medium">Last Login:</span>{" "}
              {student.last_login_at
                ? new Date(student.last_login_at).toLocaleString()
                : "Never logged in"}
            </p>
          </CardContent>
        </Card>

        {/* ENROLLED COURSES CARD */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Enrolled Courses</CardTitle>
            <CardDescription>Your current course load</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-5xl font-bold">{totalCourses}</p>
            <p className="text-muted-foreground mt-2">Total Courses</p>
          </CardContent>
        </Card>

        {/* COURSES LIST */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Your Courses</CardTitle>
            <CardDescription>Click any course to view details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {courses.length === 0 ? (
              <p className="text-muted-foreground">No courses enrolled.</p>
            ) : (
              <div className="space-y-2">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="flex justify-between items-center p-3 border rounded-lg hover:bg-accent cursor-pointer transition"
                    onClick={() => router.push(`/courses/${course.id}`)}
                  >
                    <span className="font-medium">{course.name}</span>
                    <span className="text-primary text-sm">View →</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
