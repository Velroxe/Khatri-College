"use client"

import * as React from "react"
import useEmblaCarousel from "embla-carousel-react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Scholar } from "@/lib/types"

export default function ScholarCarousel({ scholars }: { scholars: Scholar[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  const [isPaused, setIsPaused] = React.useState(false)
  const [selectedIndex, setSelectedIndex] = React.useState(0)

  const scrollPrev = React.useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = React.useCallback(() => emblaApi?.scrollNext(), [emblaApi])
  const scrollTo = React.useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi])

  React.useEffect(() => {
    if (!emblaApi) return

    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap())
    emblaApi.on("select", onSelect)
    onSelect()

    const interval = setInterval(() => {
      if (!isPaused) emblaApi.scrollNext()
    }, 5000)

    return () => {
      emblaApi.off("select", onSelect)
      clearInterval(interval)
    }
  }, [emblaApi, isPaused])

  return (
    <div
      className="w-full max-w-6xl mx-auto"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Viewport */}
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {scholars.map((scholar, i) => (
            <div
              key={i}
              className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.33%] p-4"
            >
              <motion.div
              className="h-full"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="p-6 shadow-lg rounded-2xl border h-full">
                  <CardContent className="space-y-4">

                    <div className="flex justify-center">
                      <Avatar className="w-[110px] h-[110px]">
                        <AvatarImage src={scholar.image_url || ""} />
                        <AvatarFallback>
                          {scholar.name?.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </div>

                    <h3 className="text-2xl font-semibold text-center">
                      {scholar.name}
                    </h3>

                    <p className="text-center text-blue-600 font-medium">
                      {scholar.degree}
                    </p>

                    {/* Subjects */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-center">
                        Top Subjects
                      </h4>
                      <div className="flex flex-wrap justify-center gap-2">
                        {scholar.subjects?.map((s, idx) => (
                          <Badge key={idx} variant="secondary">
                            {s.subject} — {s.marks}
                          </Badge>
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
          {scholars.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              className={`w-3 h-3 rounded-full border ${
                selectedIndex === i ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>

        <Button variant="outline" onClick={scrollNext}>
          <ChevronRight />
        </Button>
      </div>
    </div>
  )
}
