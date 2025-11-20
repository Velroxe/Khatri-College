import express from "express";
import { verifyAuthAdmin } from "../middleware/authMiddleware.js";
import { sql } from "../db/index.js";

const router = express.Router();

/* =====================================================
   1️⃣ ADD A NEW DOCUMENT
   ===================================================== */
router.post("/", verifyAuthAdmin, async (req, res) => {
  const { name, public_file_id, public_url, course_id } = req.body;

  if (!name || !public_file_id || !public_url || !course_id) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    // ✅ Check if course exists
    const course = await sql`SELECT * FROM courses WHERE id = ${course_id}`;
    if (course.length === 0)
      return res.status(404).json({ message: "Course not found" });

    // ✅ Insert document
    const [doc] = await sql`
      INSERT INTO documents (name, public_file_id, public_url, course_id)
      VALUES (${name}, ${public_file_id}, ${public_url}, ${course_id})
      RETURNING *;
    `;

    res.status(201).json({
      message: "Document added successfully",
      document: doc,
    });
  } catch (err) {
    console.error("Error adding document:", err);
    res.status(500).json({ message: "Server error while adding document" });
  }
});

/* =====================================================
   2️⃣ DELETE A DOCUMENT BY PUBLIC FILE ID
   ===================================================== */
router.delete("/:publicFileId", verifyAuthAdmin, async (req, res) => {
  const { publicFileId } = req.params;

  try {
    const result = await sql`
      DELETE FROM documents WHERE public_file_id = ${publicFileId}
      RETURNING *;
    `;

    if (result.length === 0)
      return res.status(404).json({ message: "Document not found" });

    res.json({
      message: "Document deleted successfully",
      deleted: result[0],
    });
  } catch (err) {
    console.error("Error deleting document:", err);
    res.status(500).json({ message: "Server error while deleting document" });
  }
});

export default router;
