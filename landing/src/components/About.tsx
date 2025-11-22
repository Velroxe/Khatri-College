"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function About() {
  return (
    <section
      id="about"
      className="py-24 px-4 bg-background"
    >
      <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center">

        {/* ---------------- LEFT SIDE (IMAGE) ---------------- */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="relative w-full h-80 md:h-[420px] rounded-xl overflow-hidden shadow-xl"
        >
          {/* Replace this with your real image */}
          <Image
            src="/assets/images/about.jpg"
            alt="About Khatri College"
            fill
            className="object-cover"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-background/30 dark:from-background/60 to-transparent" />
        </motion.div>

        {/* ---------------- RIGHT SIDE (TEXT) ---------------- */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <h2 className="text-3xl md:text-4xl font-bold">
            About <span className="text-primary">Khatri College</span>
          </h2>

          <p className="text-muted-foreground leading-relaxed text-lg">
            Khatri College is dedicated to shaping future leaders
            through academic excellence, modern education methods,
            and a supportive learning environment. Our goal is to
            empower students with the skills and knowledge they need
            to excel in their careers and contribute meaningfully to
            society.
          </p>

          <p className="text-muted-foreground leading-relaxed">
            With experienced faculties, comprehensive programs, and
            a growing community of scholars, we continue to build an
            educational ecosystem that values growth, discipline,
            creativity, and innovation.
          </p>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-6 pt-4">
            <div className="text-center">
              <h3 className="text-3xl font-bold">1500+</h3>
              <p className="text-sm text-muted-foreground">Students</p>
            </div>

            <div className="text-center">
              <h3 className="text-3xl font-bold">25+</h3>
              <p className="text-sm text-muted-foreground">Courses</p>
            </div>

            <div className="text-center">
              <h3 className="text-3xl font-bold">40+</h3>
              <p className="text-sm text-muted-foreground">Faculties</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
