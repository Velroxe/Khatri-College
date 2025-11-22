"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative w-full pt-24 pb-32 overflow-hidden"
    >
      <div className="container mx-auto grid lg:grid-cols-2 gap-10 items-center px-4">

        {/* ---------------- LEFT SIDE (TEXT) ---------------- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Welcome to{" "}
            <span className="text-primary">
              Khatri College
            </span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-xl">
            A place where education meets excellence.
            Explore top-tier courses, experienced faculties,
            and a thriving academic community.
          </p>

          <div className="flex gap-4 mt-6">
            <motion.a
              href="#courses"
              className="px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Explore Courses
            </motion.a>

            <motion.a
              href="#contact"
              className="px-6 py-3 border border-primary text-primary rounded-md font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Apply Now
            </motion.a>
          </div>
        </motion.div>

        {/* ---------------- RIGHT SIDE (IMAGE) ---------------- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="relative w-full h-80 md:h-[450px] rounded-xl overflow-hidden shadow-lg"
        >
          {/* If you have your college image, replace below */}
          <Image
            src="/assets/images/banner.jpg"
            alt="Khatri College"
            fill
            className="object-cover"
            priority
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-background/40 dark:from-background/80 to-transparent" />
        </motion.div>
      </div>

      {/* Decorative blurred circle */}
      <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-primary/20 blur-3xl opacity-50 pointer-events-none" />
    </section>
  );
}
