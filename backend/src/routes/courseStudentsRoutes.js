import express from "express";
import { sql } from "../db/index.js"; // adjust path to your database connection file
import { verifyAuthAdmin } from "../middleware/authMiddleware.js"; // secure routes

const router = express.Router();

/* =====================================================
   🔄 SYNC STUDENT LIST FOR A COURSE
   ===================================================== */
router.put("/:courseId/students", verifyAuthAdmin, async (req, res) => {
  const { courseId } = req.params;
  const { studentIds } = req.body; // array of student UUIDs

  if (!Array.isArray(studentIds))
    return res.status(400).json({ message: "studentIds array is required" });

  try {
    // ✅ Verify course exists
    const course = await sql`SELECT * FROM courses WHERE id = ${courseId}`;
    if (course.length === 0)
      return res.status(404).json({ message: "Course not found" });

    // ✅ Get currently enrolled students
    const existing = await sql`
      SELECT student_id FROM student_courses WHERE course_id = ${courseId}
    `;
    const existingIds = existing.map((r) => r.student_id);

    // ✅ Determine which students to add and which to remove
    const toAdd = studentIds.filter((id) => !existingIds.includes(id));
    const toRemove = existingIds.filter((id) => !studentIds.includes(id));

    // ✅ Add new students
    for (const studentId of toAdd) {
      await sql`
        INSERT INTO student_courses (student_id, course_id)
        VALUES (${studentId}, ${courseId})
        ON CONFLICT (student_id, course_id) DO NOTHING;
      `;
    }

    // ✅ Remove deselected students
    if (toRemove.length > 0) {
      await sql`
        DELETE FROM student_courses
        WHERE course_id = ${courseId} AND student_id IN ${sql(toRemove)};
      `;
    }

    // ✅ Get updated student list with details
    const updatedStudents = await sql`
      SELECT s.*
      FROM students s
      JOIN student_courses sc ON s.id = sc.student_id
      WHERE sc.course_id = ${courseId}
      ORDER BY s.name ASC;
    `;

    res.json({
      message: "Student list updated successfully",
      added: toAdd,
      removed: toRemove,
      students: updatedStudents,
    });
  } catch (err) {
    console.error("Error syncing students:", err);
    res.status(500).json({ message: "Server error syncing students" });
  }
});

/* =====================================================
   2️⃣ REMOVE STUDENT FROM A COURSE
   ===================================================== */
router.delete("/:courseId/students/:studentId", verifyAuthAdmin, async (req, res) => {
  const { courseId, studentId } = req.params;

  try {
    const result = await sql`
      DELETE FROM student_courses
      WHERE course_id = ${courseId} AND student_id = ${studentId}
      RETURNING *;
    `;

    if (result.length === 0)
      return res.status(404).json({ message: "Student not found in this course" });

    res.json({ message: "Student removed from course successfully" });
  } catch (err) {
    console.error("Error removing student:", err);
    res.status(500).json({ message: "Server error removing student" });
  }
});

/* =====================================================
   3️⃣ GET ALL STUDENTS IN A PARTICULAR COURSE
   ===================================================== */
router.get("/:courseId/students", verifyAuthAdmin, async (req, res) => {
  const { courseId } = req.params;

  try {
    // Check course existence
    const course = await sql`SELECT * FROM courses WHERE id = ${courseId}`;
    if (course.length === 0)
      return res.status(404).json({ message: "Course not found" });

    // Join query to get student details
    const students = await sql`
      SELECT s.*, sc.enrolled_at
      FROM student_courses sc
      JOIN students s ON s.id = sc.student_id
      WHERE sc.course_id = ${courseId};
    `;

    res.json({
      course: course[0],
      totalStudents: students.length,
      students,
    });
  } catch (err) {
    console.error("Error fetching students:", err);
    res.status(500).json({ message: "Server error fetching students" });
  }
});

export default router;
