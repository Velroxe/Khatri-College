"use client";

import { COURSES } from "@/lib/constants";
import { motion } from "framer-motion";

export default function Courses() {
  return (
    <section id="courses" className="py-24 px-4 bg-background">
      <div className="container mx-auto text-center mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold"
        >
          Our <span className="text-primary">Courses</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-muted-foreground mt-4 max-w-2xl mx-auto"
        >
          Explore our wide range of academic and professional courses designed
          to provide students with strong foundational knowledge and practical skills.
        </motion.p>
      </div>

      {/* Courses Grid */}
      <div className="container mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {COURSES.map((course, index) => (
          <motion.div
            key={course.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: index * 0.08,
            }}
            className="p-6 rounded-xl border bg-card shadow-sm hover:shadow-md transition-all
                       hover:-translate-y-1 cursor-pointer"
          >
            <h3 className="text-xl font-semibold mb-3 text-primary">
              {course.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {course.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
