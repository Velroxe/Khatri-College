"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Faculty } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function FacultyDetailPage() {
  const { id } = useParams();

  const [faculty, setFaculty] = useState<Faculty | null>(null);
  const [loading, setLoading] = useState(true);

  const host = process.env.NEXT_PUBLIC_BACKEND;

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const res = await fetch(`${host}/api/faculties/${id}`, {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch faculty");

        const data = await res.json();
        setFaculty(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFaculty();
  }, [id]);

  if (loading)
    return (
      <div className="w-full flex justify-center py-20 text-lg">
        Loading...
      </div>
    );

  if (!faculty)
    return (
      <div className="w-full flex justify-center py-20 text-lg">
        Faculty not found.
      </div>
    );

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* PAGE TITLE */}
      <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        Faculty Details
      </h1>

      <Card className="p-6 dark:bg-gray-900 dark:border-gray-700">
        <div className="flex flex-col md:flex-row gap-8">
          {/* IMAGE */}
          <img
            src={
              faculty.image_url ||
              "/assets/images/placeholder-avatar.svg"
            }
            alt={faculty.name}
            className="w-40 h-40 rounded-xl object-cover border dark:border-gray-700"
          />

          {/* BASIC INFO */}
          <div className="flex flex-col justify-center space-y-2">
            <h1 className="text-3xl font-semibold dark:text-gray-100">
              {faculty.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Joined on{" "}
              {new Date(faculty.created_at).toLocaleDateString()}
            </p>

            <div className="mt-4">
              <Button
                variant="secondary"
                onClick={() => history.back()}
              >
                ← Back
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* DETAILS CARD */}
      <Card className="dark:bg-gray-900 dark:border-gray-700">
        <CardContent className="p-6 space-y-6">
          {/* Description */}
          <section>
            <h2 className="text-xl font-semibold mb-2 dark:text-gray-100">
              About
            </h2>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
              {faculty.description || "No description provided."}
            </p>
          </section>

          <hr className="border-gray-300 dark:border-gray-700" />

          {/* Qualifications */}
          <section>
            <h2 className="text-xl font-semibold mb-2 dark:text-gray-100">
              Qualifications
            </h2>
            <div className="flex flex-wrap gap-2">
              {faculty.qualifications
                .split(",")
                .filter((q) => q.trim() !== "")
                .map((q, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-gray-200 dark:bg-gray-700 dark:text-gray-200 rounded-full text-sm"
                  >
                    {q}
                  </span>
                ))}
            </div>
          </section>

          <hr className="border-gray-300 dark:border-gray-700" />

          {/* Specialities */}
          <section>
            <h2 className="text-xl font-semibold mb-2 dark:text-gray-100">
              Specialities
            </h2>
            <div className="flex flex-wrap gap-2">
              {faculty.specialities
                .split(",")
                .filter((s) => s.trim() !== "")
                .map((s, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-blue-200 dark:bg-blue-900 dark:text-blue-200 rounded-full text-sm"
                  >
                    {s}
                  </span>
                ))}
            </div>
          </section>

          <hr className="border-gray-300 dark:border-gray-700" />

          {/* Experience */}
          <section>
            <h2 className="text-xl font-semibold mb-2 dark:text-gray-100">
              Experience
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              {faculty.experience_years} year
              {faculty.experience_years > 1 ? "s" : ""}
            </p>
          </section>

          <hr className="border-gray-300 dark:border-gray-700" />

          {/* Metadata */}
          <section>
            <h2 className="text-xl font-semibold mb-2 dark:text-gray-100">
              Meta Information
            </h2>
            <div className="space-y-1 text-gray-600 dark:text-gray-400">
              <p>
                <strong>Created:</strong>{" "}
                {new Date(faculty.created_at).toLocaleString()}
              </p>
              <p>
                <strong>Last Updated:</strong>{" "}
                {new Date(faculty.updated_at).toLocaleString()}
              </p>
            </div>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
