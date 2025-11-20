import express from "express";
import { sql } from "../db/index.js";
import { verifyAuthAdmin } from "../middleware/authMiddleware.js";
const router = express.Router();

/* ================================
   📘 CREATE a new course
================================ */
router.post("/", verifyAuthAdmin, async (req, res) => {
  const { name, description, status } = req.body;
  if (!name) return res.status(400).json({ message: "Course name is required" });

  try {
    const result = await sql`
      INSERT INTO courses (name, description, status)
      VALUES (${name}, ${description || null}, ${status || "ongoing"})
      RETURNING *;
    `;
    res.status(201).json({ message: "Course created successfully", course: result[0] });
  } catch (err) {
    if (err.message.includes("duplicate key"))
      return res.status(400).json({ message: "Course name must be unique" });
    console.error("Error creating course:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================================
   📗 READ all courses
================================ */
router.get("/", verifyAuthAdmin, async (req, res) => {
  try {
    const courses = await sql`SELECT * FROM courses ORDER BY created_at DESC;`;
    res.json(courses);
  } catch (err) {
    console.error("Error fetching courses:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================================
   📙 READ single course by ID
================================ */
router.get("/:id", verifyAuthAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await sql`SELECT * FROM courses WHERE id = ${id};`;
    if (result.length === 0)
      return res.status(404).json({ message: "Course not found" });
    res.json(result[0]);
  } catch (err) {
    console.error("Error fetching course:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================================
   📒 UPDATE a course
================================ */
router.put("/:id", verifyAuthAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, description, status } = req.body;

  try {
    const result = await sql`
      UPDATE courses
      SET
        name = COALESCE(${name}, name),
        description = COALESCE(${description}, description),
        status = COALESCE(${status}, status),
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *;
    `;
    if (result.length === 0)
      return res.status(404).json({ message: "Course not found" });
    res.json({ message: "Course updated successfully", course: result[0] });
  } catch (err) {
    console.error("Error updating course:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================================
   📕 DELETE a course
================================ */
router.delete("/:id", verifyAuthAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await sql`DELETE FROM courses WHERE id = ${id} RETURNING *;`;
    if (result.length === 0)
      return res.status(404).json({ message: "Course not found" });
    res.json({ message: "Course deleted successfully" });
  } catch (err) {
    console.error("Error deleting course:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
