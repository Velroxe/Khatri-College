"use client"

import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import FacultyCarousel from "./FacultyCarousel"
import { Faculty } from "@/lib/types"

const BACKEND = process.env.NEXT_PUBLIC_BACKEND

export default function Faculties() {
  const [faculties, setFaculties] = useState<Faculty[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchFaculties() {
      try {
        const res = await fetch(`${BACKEND}/api/faculties`)
        if (!res.ok) throw new Error("Failed to fetch faculties")

        const data = await res.json()
        setFaculties(data)
      } catch (err: any) {
        setError(err.message || "Something went wrong")
      } finally {
        setLoading(false)
      }
    }
    fetchFaculties()
  }, [])

  return (
    <section id="faculties" className="py-16 px-4 md:px-6 max-w-7xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-12">Our Top Faculties</h2>

      {error && <p className="text-center text-red-600">{error}</p>}

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-6 border rounded-xl">
              <Skeleton className="h-24 w-24 rounded-full mx-auto mb-4" />
              <Skeleton className="h-4 w-40 mx-auto mb-2" />
              <Skeleton className="h-4 w-28 mx-auto mb-2" />
              <Skeleton className="h-4 w-48 mx-auto" />
            </div>
          ))}
        </div>
      )}

      {!loading && faculties.length > 0 && (
        <FacultyCarousel faculties={faculties} />
      )}

      {!loading && faculties.length === 0 && !error && (
        <p className="text-center text-gray-500 mt-6">
          No faculties added yet.
        </p>
      )}
    </section>
  )
}
