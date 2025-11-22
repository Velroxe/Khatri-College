"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Faculty } from "@/lib/types";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND;

export default function Faculties() {
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchFaculties() {
      try {
        const res = await fetch(`${BACKEND}/api/faculties`);
        if (!res.ok) throw new Error("Failed to fetch faculties.");

        const data = await res.json();
        setFaculties(data);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    fetchFaculties();
  }, []);

  return (
    <section id="faculties" className="py-16 px-4 md:px-6 max-w-7xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-12">Our Top Faculties</h2>

      {/* Error */}
      {error && (
        <p className="text-center text-red-600 font-medium">{error}</p>
      )}

      {/* Loading Skeleton Carousel */}
      {loading && (
        <Carousel className="w-full max-w-full">
          <CarouselContent>
            {Array.from({ length: 3 }).map((_, i) => (
              <CarouselItem key={i} className="md:basis-1/2 lg:basis-1/3">
                <Card className="p-6 text-center">
                  <Skeleton className="h-24 w-24 rounded-full mx-auto mb-4" />
                  <Skeleton className="h-4 w-40 mx-auto mb-2" />
                  <Skeleton className="h-4 w-28 mx-auto mb-2" />
                  <Skeleton className="h-4 w-48 mx-auto" />
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      )}

      {/* Faculties Carousel */}
      {!loading && faculties.length > 0 && (
        <Carousel className="w-full max-w-full">
          <CarouselContent className="pb-8">
            {faculties.map((faculty, index) => (
              <CarouselItem
                key={faculty.id}
                className="md:basis-1/2 lg:basis-1/3"
              >
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6 shadow-lg rounded-2xl border h-full">
                    <CardContent className="space-y-4">

                      {/* Avatar */}
                      <div className="flex justify-center">
                        <Avatar className="w-28 h-28 md:w-32 md:h-32 shadow-lg">
                          <AvatarImage src={faculty.image_url || ""} />
                          <AvatarFallback>
                            {faculty.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </div>

                      {/* Name */}
                      <h3 className="text-2xl font-semibold text-center">
                        {faculty.name}
                      </h3>

                      {/* Description */}
                      <p className="text-muted-foreground text-center text-sm">
                        {faculty.description?.length > 30
                          ? faculty.description.slice(0, 30) + "..."
                          : faculty.description}
                      </p>

                      {/* Experience */}
                      <p className="text-center font-medium">
                        Experience:{" "}
                        <span className="text-blue-600">
                          {faculty.experience_years} years
                        </span>
                      </p>

                      {/* Qualifications */}
                      <div className="space-y-1">
                        <h4 className="text-sm font-semibold">Qualifications</h4>
                        <div className="flex flex-wrap gap-2">
                          {faculty.qualifications
                            ?.split(",")
                            .filter((q) => q.trim() !== "")
                            .map((q, idx) => (
                              <Badge key={idx} variant="secondary">
                                {q.trim()}
                              </Badge>
                            ))}
                        </div>
                      </div>

                      {/* Specialities */}
                      <div className="space-y-1">
                        <h4 className="text-sm font-semibold">Specialities</h4>
                        <div className="flex flex-wrap gap-2">
                          {faculty.specialities
                            ?.split(",")
                            .filter((s) => s.trim() !== "")
                            .map((s, idx) => (
                              <Badge key={idx}>{s.trim()}</Badge>
                            ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Controls */}
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      )}

      {!loading && faculties.length === 0 && !error && (
        <p className="text-center text-gray-500 mt-6">
          No faculties added yet.
        </p>
      )}
    </section>
  );
}
