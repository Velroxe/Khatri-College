"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Faculty } from "@/lib/types"

export default function FacultyCarousel({ faculties }: { faculties: Faculty[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  const [isPaused, setIsPaused] = React.useState(false)
  const [selectedIndex, setSelectedIndex] = React.useState(0)

  const scrollPrev = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const scrollTo = React.useCallback((index: number) => {
    if (emblaApi) emblaApi.scrollTo(index)
  }, [emblaApi])

  React.useEffect(() => {
    if (!emblaApi) return

    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap())
    emblaApi.on("select", onSelect)
    onSelect()

    const interval = setInterval(() => {
      if (!isPaused) emblaApi.scrollNext()
    }, 5000)

    return () => {
      clearInterval(interval)
      emblaApi.off("select", onSelect)
    }
  }, [emblaApi, isPaused])

  return (
    <div
      className="w-full max-w-6xl mx-auto"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Carousel viewport */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {faculties.map((faculty, index) => (
            <div
              key={faculty.id}
              className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.33%] p-4"
            >
              <motion.div
                className="h-full"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 shadow-lg rounded-2xl border h-full">
                  <CardContent className="space-y-4">

                    <div className="flex justify-center">
                      <Avatar className="w-28 h-28 md:w-32 md:h-32 shadow-lg">
                        <AvatarImage src={faculty.image_url || ""} />
                        <AvatarFallback>
                          {faculty.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </div>

                    <h3 className="text-2xl font-semibold text-center">
                      {faculty.name}
                    </h3>

                    <p className="text-muted-foreground text-center text-sm">
                      {faculty.description?.length > 30
                        ? faculty.description.slice(0, 30) + "..."
                        : faculty.description}
                    </p>

                    <p className="text-center font-medium">
                      Experience:{" "}
                      <span className="text-blue-600">
                        {faculty.experience_years} years
                      </span>
                    </p>

                    {/* Qualifications */}
                    <div>
                      <h4 className="text-sm font-semibold mb-1">Qualifications</h4>
                      <div className="flex flex-wrap gap-2">
                        {faculty.qualifications
                          ?.split(",")
                          .filter(Boolean)
                          .map((q, idx) => (
                            <Badge key={idx} variant="secondary">
                              {q.trim()}
                            </Badge>
                          ))}
                      </div>
                    </div>

                    {/* Specialities */}
                    <div>
                      <h4 className="text-sm font-semibold mb-1">Specialities</h4>
                      <div className="flex flex-wrap gap-2">
                        {faculty.specialities
                          ?.split(",")
                          .filter(Boolean)
                          .map((s, idx) => (
                            <Badge key={idx}>{s.trim()}</Badge>
                          ))}
                      </div>
                    </div>

                  </CardContent>
                </Card>
              </motion.div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center mt-4">
        <Button variant="outline" onClick={scrollPrev}>
          <ChevronLeft />
        </Button>

        {/* Dots */}
        <div className="flex gap-2">
          {faculties.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`w-3 h-3 rounded-full border ${selectedIndex === index ? "bg-primary" : "bg-muted"
                }`}
            />
          ))}
        </div>

        <Button variant="outline" onClick={scrollNext}>
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}
