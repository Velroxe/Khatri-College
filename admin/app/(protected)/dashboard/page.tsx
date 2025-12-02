"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Users, BookOpen, UserCheck, GraduationCap, FileText } from "lucide-react";

type DashboardPayload = {
  totalStudents: number;
  totalCourses: number;
  totalFaculties: number;
  totalScholars: number;
  totalDocuments: number;

  recentStudents: {
    id: string;
    name: string;
    email: string;
    created_at: string;
  }[];

  recentCourses: {
    id: string;
    name: string;
    created_at: string;
  }[];

  recentDocuments: {
    id: string;
    name: string;
    public_file_id: string;
    course_id: string;
    created_at: string;
  }[];

  courseStats: {
    studentsPerCourse: {
      courseId: string;
      courseName: string;
      studentCount: number;
    }[];
    completedCourses: number;
    ongoingCourses: number;
  };

  studentStats: {
    topEnrolledStudents: {
      id: string;
      name: string;
      email: string;
      coursesEnrolled: number;
    }[];
    recentEnrollments: {
      student_id: string;
      student_name: string;
      course_id: string;
      course_name: string;
      enrolled_at: string;
    }[];
  };

  scholarStats: {
    topScholars: {
      id: string;
      name: string;
      avgMarks: number;
      subjectsCount: number;
    }[];
  };

  facultyStats: {
    mostExperiencedFaculties: {
      id: string;
      name: string;
      qualifications: string;
      experienceYears: number;
      imageUrl: string;
    }[];
  };
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardPayload | null>(null);
  const [loading, setLoading] = useState(true);

  const host = process.env.NEXT_PUBLIC_BACKEND || "";

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${host}/api/dashboard`, {
          credentials: "include",
        });
        const json = await res.json();
        // console.log(json);
        setData(json);
      } catch (err) {
        console.error("Failed to fetch dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [host]);

  const formatDateShort = (iso?: string) => {
    if (!iso) return "-";
    try {
      const d = new Date(iso);
      return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
    } catch {
      return iso;
    }
  };

  const formatDateTime = (iso?: string) => {
    if (!iso) return "-";
    try {
      const d = new Date(iso);
      return d.toLocaleString();
    } catch {
      return iso;
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading dashboard…</div>;
  }

  if (!data) {
    return <div className="p-8 text-center">No dashboard data available.</div>;
  }

  const metricCards = [
    { label: "Students", value: data.totalStudents, icon: Users },
    { label: "Courses", value: data.totalCourses, icon: BookOpen },
    { label: "Faculties", value: data.totalFaculties, icon: UserCheck },
    { label: "Scholars", value: data.totalScholars, icon: GraduationCap },
    { label: "Documents", value: data.totalDocuments, icon: FileText },
  ];

  // prepare bar chart data (students per course)
  const barData = data.courseStats.studentsPerCourse.map((c) => ({
    name: c.courseName,
    students: c.studentCount,
  }));

  // small palette for bars
  const BAR_COLORS = ["#60A5FA", "#34D399", "#FBBF24", "#F87171", "#A78BFA", "#F472B6"];

  return (
    <div className="p-6 space-y-8">
      <div className="flex flex-col lg:flex-row items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Overview & analytics — updated: {formatDateTime(new Date().toISOString())}
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {metricCards.map((m, i) => {
          const Icon = m.icon;
          return (
            <Card key={m.label} className="shadow-sm">
              <CardContent className="flex items-center justify-between gap-4 p-4">
                <div>
                  <p className="text-sm text-muted-foreground">{m.label}</p>
                  <p className="text-2xl font-semibold">{m.value}</p>
                </div>
                <div className="rounded-md p-2 bg-muted/50">
                  <Icon className="h-7 w-7 text-primary" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts & course overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle>Students per Course</CardTitle>
          </CardHeader>
          <CardContent>
            {barData.length === 0 ? (
              <p className="text-sm text-muted-foreground">No course data available.</p>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} margin={{ top: 8, right: 16, left: 0, bottom: 16 }}>
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} angle={-20} textAnchor="end" height={60} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="students">
                      {barData.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={BAR_COLORS[idx % BAR_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Course Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <div className="text-sm text-muted-foreground">Completed</div>
                <div className="font-semibold">{data.courseStats.completedCourses}</div>
              </div>
              <div className="flex justify-between">
                <div className="text-sm text-muted-foreground">Ongoing</div>
                <div className="font-semibold">{data.courseStats.ongoingCourses}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Recent Students</CardTitle>
          </CardHeader>
          <CardContent>
            {data.recentStudents.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recent students</p>
            ) : (
              <ul className="space-y-3">
                {data.recentStudents.map((s) => (
                  <li key={s.id} className="flex flex-col sm:flex-row sm:justify-between gap-1">
                    <div>
                      <div className="font-medium">{s.name}</div>
                      <div className="text-xs text-muted-foreground">{s.email}</div>
                    </div>
                    <div className="text-xs text-muted-foreground">{formatDateShort(s.created_at)}</div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Recent Courses</CardTitle>
          </CardHeader>
          <CardContent>
            {data.recentCourses.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recent courses</p>
            ) : (
              <ul className="space-y-3">
                {data.recentCourses.map((c) => (
                  <li key={c.id} className="flex justify-between">
                    <div className="font-medium">{c.name}</div>
                    <div className="text-xs text-muted-foreground">{formatDateShort(c.created_at)}</div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Recent Documents</CardTitle>
          </CardHeader>
          <CardContent>
            {data.recentDocuments.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recent documents</p>
            ) : (
              <ul className="space-y-3">
                {data.recentDocuments.map((d) => (
                  <li key={d.id} className="flex justify-between">
                    <div className="overflow-hidden">
                      <div className="font-medium truncate">{d.name}</div>
                      <div className="text-xs text-muted-foreground">course: {d.course_id}</div>
                    </div>
                    <div className="text-xs text-muted-foreground">{formatDateShort(d.created_at)}</div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Student stats and recent enrollments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Top Enrolled Students</CardTitle>
          </CardHeader>
          <CardContent>
            {data.studentStats.topEnrolledStudents.length === 0 ? (
              <p className="text-sm text-muted-foreground">No data</p>
            ) : (
              <ul className="space-y-2">
                {data.studentStats.topEnrolledStudents.map((s) => (
                  <li key={s.id} className="flex justify-between">
                    <div>
                      <div className="font-medium">{s.name}</div>
                      <div className="text-xs text-muted-foreground">{s.email}</div>
                    </div>
                    <div className="text-sm font-semibold">{s.coursesEnrolled}</div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Recent Enrollments</CardTitle>
          </CardHeader>
          <CardContent>
            {data.studentStats.recentEnrollments.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recent enrollments</p>
            ) : (
              <ul className="space-y-2">
                {data.studentStats.recentEnrollments.map((r, idx) => (
                  <li key={idx} className="flex flex-col sm:flex-row sm:justify-between gap-1">
                    <div>
                      <div className="font-medium">{r.student_name}</div>
                      <div className="text-xs text-muted-foreground">course: {r.course_name}</div>
                    </div>
                    <div className="text-xs text-muted-foreground">{formatDateShort(r.enrolled_at)}</div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Scholars & Faculty */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Top Scholars</CardTitle>
          </CardHeader>
          <CardContent>
            {data.scholarStats.topScholars.length === 0 ? (
              <p className="text-sm text-muted-foreground">No scholar stats</p>
            ) : (
              <ul className="space-y-2">
                {data.scholarStats.topScholars.map((s) => (
                  <li key={s.id} className="flex justify-between">
                    <div>
                      <div className="font-medium">{s.name}</div>
                      <div className="text-xs text-muted-foreground">{s.subjectsCount} subjects</div>
                    </div>
                    <div className="text-sm font-semibold">{s.avgMarks}</div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Most Experienced Faculties</CardTitle>
          </CardHeader>
          <CardContent>
            {data.facultyStats.mostExperiencedFaculties.length === 0 ? (
              <p className="text-sm text-muted-foreground">No faculty data</p>
            ) : (
              <ul className="space-y-3">
                {data.facultyStats.mostExperiencedFaculties.map((f) => (
                  <li key={f.id} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={f.imageUrl || "/assets/images/placeholder-avatar.svg"}
                        alt={f.name}
                        className="w-10 h-10 rounded-full object-cover border"
                      />
                      <div>
                        <div className="font-medium">{f.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {f.qualifications?.split(",").map((q) => q.trim()).filter(Boolean).join(" • ")}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm font-semibold">{f.experienceYears}y</div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
