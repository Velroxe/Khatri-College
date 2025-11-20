import express from "express";
import { verifyAuthAdmin } from "../middleware/authMiddleware.js";
import { sql } from "../db/index.js";

const router = express.Router();

/* =====================================================
   3️⃣ GET ALL DOCUMENTS FOR A COURSE
   ===================================================== */
router.get("/:courseId/documents", verifyAuthAdmin, async (req, res) => {
  const { courseId } = req.params;

  try {
    const course = await sql`SELECT * FROM courses WHERE id = ${courseId}`;
    if (course.length === 0)
      return res.status(404).json({ message: "Course not found" });

    const documents = await sql`
      SELECT id, name, public_file_id, public_url, created_at
      FROM documents
      WHERE course_id = ${courseId}
      ORDER BY created_at DESC;
    `;

    res.json({
      message: "Documents fetched successfully",
      course: course[0].name,
      documents,
    });
  } catch (err) {
    console.error("Error fetching documents:", err);
    res.status(500).json({ message: "Server error while fetching documents" });
  }
});


export default router;