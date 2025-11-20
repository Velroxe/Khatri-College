"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Student } from "@/lib/types";

export function StudentInfoCard({ student }: { student: Student }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <p>
          <span className="font-medium">Name:</span> {student.name}
        </p>
        <p>
          <span className="font-medium">Email:</span> {student.email}
        </p>
        <p className="flex items-center gap-2">
          <span className="font-medium">Status:</span>
          <Badge
            variant={
              student.status === "active"
                ? "default"
                : student.status === "suspended"
                ? "secondary"
                : "outline"
            }
          >
            {student.status}
          </Badge>
        </p>
        <p>
          <span className="font-medium">Created At:</span>{" "}
          {new Date(student.created_at).toLocaleString()}
        </p>
        <p>
          <span className="font-medium">Updated At:</span>{" "}
          {new Date(student.updated_at).toLocaleString()}
        </p>
      </CardContent>
    </Card>
  );
}
