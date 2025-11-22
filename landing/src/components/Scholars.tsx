"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND;

export default function Scholars() {
  const [scholars, setScholars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchScholars() {
      try {
        const res = await fetch(`${BACKEND}/api/scholars`);
        if (!res.ok) throw new Error("Failed to fetch scholars.");

        const data = await res.json();
        console.log(data);
        setScholars(data);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    fetchScholars();
  }, []);

  return (
    <section id="scholars" className="py-16 px-4 md:px-6 max-w-7xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-12">Our Scholars</h2>

      {error && (
        <p className="text-center text-red-600 font-medium">{error}</p>
      )}

      {/* Loading State */}
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

      {/* Scholars Carousel */}
      {!loading && scholars.length > 0 && (
        <Carousel className="w-full max-w-full">
          <CarouselContent className="pb-8">
            {scholars.map((scholar, index) => (
              <CarouselItem
                key={index}
                className="md:basis-1/2 lg:basis-1/3"
              >
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6 shadow-lg rounded-2xl border h-full">
                    <CardContent className="space-y-4">

                      {/* Avatar (bigger as requested) */}
                      <div className="flex justify-center">
                        <Avatar className="w-[110px] h-[110px]">
                          <AvatarImage src={scholar.image_url || ""} />
                          <AvatarFallback>
                            {scholar.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </div>

                      {/* Name */}
                      <h3 className="text-2xl font-semibold text-center">
                        {scholar.name}
                      </h3>

                      {/* Degree */}
                      <p className="text-center text-blue-600 font-medium">
                        {scholar.degree}
                      </p>

                      {/* Subjects */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-center">
                          Top Subjects
                        </h4>

                        <div className="flex flex-wrap justify-center gap-2">
                          {scholar.subjects?.map((sub: any, idx: number) => (
                            <Badge key={idx} variant="secondary">
                              {sub.subject} — {sub.marks}
                            </Badge>
                          ))}
                        </div>
                      </div>

                    </CardContent>
                  </Card>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      )}

      {!loading && scholars.length === 0 && !error && (
        <p className="text-center text-gray-500 mt-6">
          No scholars added yet.
        </p>
      )}
    </section>
  );
}
