import express from "express";
import { sql } from "../db/index.js"; // assuming you export sql or pool from db/index.js
import { verifyAuthAdmin, verifyAuthStudent } from "../middleware/authMiddleware.js"; // JWT auth middleware
import bcrypt from "bcrypt";

const router = express.Router();

/* ================================
   🟢 CREATE STUDENT
================================ */
router.post("/", verifyAuthAdmin, async (req, res) => {
  const { name, email, password, status } = req.body;
  if (!name || !email)
    return res.status(400).json({ message: "Name and email are required." });

  try {
    const hashedPassword = await bcrypt.hash(password ? password : "password123", 10);

    const existing = await sql`SELECT * FROM students WHERE email = ${email}`;
    if (existing.length > 0)
      return res.status(409).json({ message: "Email already exists." });

    const result = await sql`
      INSERT INTO students (name, email, password_hash, status)
      VALUES (${name}, ${email}, ${hashedPassword}, ${status || "active"})
      RETURNING id, name, email, status, created_at;
    `;

    res.status(201).json({ message: "Student created successfully", student: result[0] });
  } catch (err) {
    console.error("Create student error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================================
   🟡 GET ALL STUDENTS
================================ */
router.get("/", verifyAuthAdmin, async (req, res) => {
  try {
    const students = await sql`SELECT id, name, email, status, created_at, updated_at FROM students ORDER BY created_at DESC;`;
    res.json(students);
  } catch (err) {
    console.error("Get students error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================================
   🔵 GET SINGLE STUDENT
================================ */
router.get("/:id", verifyAuthAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const student = await sql`SELECT id, name, email, status, created_at, updated_at FROM students WHERE id = ${id}`;
    if (student.length === 0)
      return res.status(404).json({ message: "Student not found" });
    res.json(student[0]);
  } catch (err) {
    console.error("Get student error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================================
   🟠 UPDATE STUDENT
================================ */
router.put("/:id", verifyAuthAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, email, password, status } = req.body;

  try {
    const existing = await sql`SELECT * FROM students WHERE id = ${id}`;
    if (existing.length === 0)
      return res.status(404).json({ message: "Student not found" });

    let hashedPassword = existing[0].password_hash;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const updated = await sql`
      UPDATE students 
      SET 
        name = ${name || existing[0].name},
        email = ${email || existing[0].email},
        password_hash = ${hashedPassword},
        status = ${status || existing[0].status},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING id, name, email, status, updated_at;
    `;

    res.json({ message: "Student updated successfully", student: updated[0] });
  } catch (err) {
    console.error("Update student error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================================
   🔴 DELETE STUDENT
================================ */
router.delete("/:id", verifyAuthAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await sql`DELETE FROM students WHERE id = ${id} RETURNING id;`;
    if (result.length === 0)
      return res.status(404).json({ message: "Student not found" });

    res.json({ message: "Student deleted successfully" });
  } catch (err) {
    console.error("Delete student error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =====================================================
   📚 GET ALL COURSES A STUDENT IS ENROLLED IN By Admin
   ===================================================== */
router.get("/:studentId/courses", verifyAuthAdmin, async (req, res) => {
  const { studentId } = req.params;

  try {
    // ✅ Check if student exists
    const student = await sql`SELECT * FROM students WHERE id = ${studentId}`;
    if (student.length === 0)
      return res.status(404).json({ message: "Student not found" });

    // ✅ Fetch all courses that this student is enrolled in
    const enrolledCourses = await sql`
      SELECT 
        c.id,
        c.name,
        c.description,
        c.status,
        sc.enrolled_at
      FROM student_courses sc
      JOIN courses c ON sc.course_id = c.id
      WHERE sc.student_id = ${studentId}
      ORDER BY sc.enrolled_at DESC;
    `;

    res.json({
      message: "Enrolled courses fetched successfully",
      student: {
        id: student[0].id,
        name: student[0].name,
        email: student[0].email,
      },
      courses: enrolledCourses,
    });
  } catch (err) {
    console.error("Error fetching student courses:", err);
    res.status(500).json({ message: "Server error fetching student courses" });
  }
});

/* =====================================================
   📚 GET ALL COURSES A STUDENT IS ENROLLED IN By Admin
   ===================================================== */
router.get("/:studentId/mycourses", verifyAuthStudent, async (req, res) => {
  const { studentId } = req.params;
  const studentIdFromVerify = req.student.studentId;

  if(studentId !== studentIdFromVerify) {
    console.error("Error fetching student courses, fake request.");
    res.status(401).json({ message: "Server error fetching student courses" });
  }

  try {
    // ✅ Check if student exists
    const student = await sql`SELECT * FROM students WHERE id = ${studentId}`;
    if (student.length === 0)
      return res.status(404).json({ message: "Student not found" });

    // ✅ Fetch all courses that this student is enrolled in
    const enrolledCourses = await sql`
      SELECT 
        c.id,
        c.name,
        c.description,
        c.status,
        sc.enrolled_at
      FROM student_courses sc
      JOIN courses c ON sc.course_id = c.id
      WHERE sc.student_id = ${studentId}
      ORDER BY sc.enrolled_at DESC;
    `;

    res.json({
      message: "Enrolled courses fetched successfully",
      student: {
        id: student[0].id,
        name: student[0].name,
        email: student[0].email,
      },
      courses: enrolledCourses,
    });
  } catch (err) {
    console.error("Error fetching student courses:", err);
    res.status(500).json({ message: "Server error fetching student courses" });
  }
});

/* ================================
   📘 GET course details (Student)
================================ */
router.get("/courses/:id", verifyAuthStudent, async (req, res) => {
  const { id: courseId } = req.params;
  const studentId = req.student.studentId; 
  // assuming verifyAuthStudent sets req.student = { studentId }

  try {
    // 1️⃣ Check if course exists
    const courseResult = await sql`
      SELECT * FROM courses WHERE id = ${courseId};
    `;

    if (courseResult.length === 0) {
      return res.status(404).json({ message: "Course not found" });
    }

    // 2️⃣ Check if student is enrolled in this course
    const enrollmentResult = await sql`
      SELECT * FROM student_courses 
      WHERE student_id = ${studentId} AND course_id = ${courseId};
    `;

    if (enrollmentResult.length === 0) {
      return res.status(403).json({
        message: "You are not enrolled in this course",
      });
    }

    // 3️⃣ Return course details if enrolled
    res.json({
      message: "Course fetched successfully",
      course: { ...courseResult[0], enrolled_at: enrollmentResult[0].enrolled_at},
    });

  } catch (err) {
    console.error("Error fetching student course:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =====================================================
   GET ALL DOCUMENTS FOR A COURSE (STUDENT)
   ===================================================== */
router.get("/courses/:courseId/documents", verifyAuthStudent, async (req, res) => {
  const { courseId } = req.params;
  const studentId = req.student.studentId; // from verifyAuthStudent JWT

  try {
    /* 1️⃣ Check if course exists */
    const course = await sql`
      SELECT * FROM courses WHERE id = ${courseId};
    `;
    if (course.length === 0) {
      return res.status(404).json({ message: "Course not found" });
    }

    /* 2️⃣ Check if student is enrolled in this course */
    const enrollment = await sql`
      SELECT * FROM student_courses
      WHERE student_id = ${studentId}
      AND course_id = ${courseId};
    `;
    if (enrollment.length === 0) {
      return res.status(403).json({ message: "You are not enrolled in this course" });
    }

    /* 3️⃣ Fetch documents */
    const documents = await sql`
      SELECT id, name, public_file_id, public_url, created_at
      FROM documents
      WHERE course_id = ${courseId}
      ORDER BY created_at DESC;
    `;

    /* 4️⃣ Response */
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
