import express from "express";
import { sql } from "../db/index.js";
import { verifyAuthAdmin, verifyAuthStudent } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * GET /api/dashboard
 * Protected - returns aggregated analytics used by the admin dashboard
 */
router.get("/", verifyAuthAdmin, async (req, res) => {
  try {
    // === Totals ===
    const [{ count: totalStudentsStr }] = await sql`SELECT COUNT(*)::text FROM students`;
    const [{ count: totalCoursesStr }] = await sql`SELECT COUNT(*)::text FROM courses`;
    const [{ count: totalFacultiesStr }] = await sql`SELECT COUNT(*)::text FROM faculties`;
    const [{ count: totalScholarsStr }] = await sql`SELECT COUNT(*)::text FROM scholars`;
    const [{ count: totalDocumentsStr }] = await sql`SELECT COUNT(*)::text FROM documents`;

    const totalStudents = Number(totalStudentsStr);
    const totalCourses = Number(totalCoursesStr);
    const totalFaculties = Number(totalFacultiesStr);
    const totalScholars = Number(totalScholarsStr);
    const totalDocuments = Number(totalDocumentsStr);

    // === Recent records (last 5) ===
    const recentStudents = await sql`
      SELECT id, name, email, created_at
      FROM students
      ORDER BY created_at DESC
      LIMIT 5;
    `;

    const recentCourses = await sql`
      SELECT id, name, created_at
      FROM courses
      ORDER BY created_at DESC
      LIMIT 5;
    `;

    const recentDocuments = await sql`
      SELECT id, name, public_file_id, course_id, created_at
      FROM documents
      ORDER BY created_at DESC
      LIMIT 5;
    `;

    // === Course analytics ===
    // studentsPerCourse: course id, name and count
    const studentsPerCourseRaw = await sql`
      SELECT c.id AS course_id, c.name AS course_name, COALESCE(count(sc.student_id), 0) AS student_count
      FROM courses c
      LEFT JOIN student_courses sc ON c.id = sc.course_id
      GROUP BY c.id, c.name
      ORDER BY student_count DESC, c.name ASC;
    `;

    const studentsPerCourse = studentsPerCourseRaw.map(r => ({
      courseId: r.course_id,
      courseName: r.course_name,
      studentCount: Number(r.student_count),
    }));

    const [{ count: completedCoursesStr }] = await sql`
      SELECT COUNT(*)::text FROM courses WHERE status = 'completed';
    `;
    const completedCourses = Number(completedCoursesStr);
    const ongoingCourses = totalCourses - completedCourses;

    // === Student analytics ===
    const topEnrolledStudentsRaw = await sql`
      SELECT s.id, s.name, s.email, COALESCE(COUNT(sc.course_id), 0) AS courses_enrolled
      FROM students s
      LEFT JOIN student_courses sc ON s.id = sc.student_id
      GROUP BY s.id, s.name, s.email
      ORDER BY courses_enrolled DESC, s.name ASC
      LIMIT 5;
    `;

    const topEnrolledStudents = topEnrolledStudentsRaw.map(r => ({
      id: r.id,
      name: r.name,
      email: r.email,
      coursesEnrolled: Number(r.courses_enrolled),
    }));

    const recentEnrollments = await sql`
      SELECT sc.student_id, s.name AS student_name, sc.course_id, c.name AS course_name, sc.enrolled_at
      FROM student_courses sc
      JOIN students s ON s.id = sc.student_id
      JOIN courses c ON c.id = sc.course_id
      ORDER BY sc.enrolled_at DESC
      LIMIT 10;
    `;

    // === Scholar analytics ===
    const topScholarsRaw = await sql`
      SELECT sch.id, sch.name, ROUND(AVG(st.marks)::numeric, 2) AS avg_marks, COUNT(st.id) AS subjects_count
      FROM scholars sch
      JOIN scholar_top_subjects st ON st.scholar_id = sch.id
      GROUP BY sch.id, sch.name
      ORDER BY avg_marks DESC NULLS LAST
      LIMIT 5;
    `;

    const topScholars = topScholarsRaw.map(r => ({
      id: r.id,
      name: r.name,
      avgMarks: r.avg_marks === null ? null : Number(r.avg_marks),
      subjectsCount: Number(r.subjects_count),
    }));

    // === Faculty analytics ===
    const mostExperiencedFacultiesRaw = await sql`
      SELECT id, name, qualifications, experience_years, image_url
      FROM faculties
      ORDER BY experience_years DESC NULLS LAST
      LIMIT 5;
    `;

    const mostExperiencedFaculties = mostExperiencedFacultiesRaw.map(r => ({
      id: r.id,
      name: r.name,
      qualifications: r.qualifications,
      experienceYears: r.experience_years === null ? null : Number(r.experience_years),
      imageUrl: r.image_url,
    }));

    // === Final response shape (matches agreed variable names) ===
    return res.json({
      totalStudents,
      totalCourses,
      totalFaculties,
      totalScholars,
      totalDocuments,

      recentStudents,   // array of { id, name, email, created_at }
      recentCourses,    // array of { id, name, created_at }
      recentDocuments,  // array of { id, name, public_file_id, course_id, created_at }

      courseStats: {
        studentsPerCourse, // array of { courseId, courseName, studentCount }
        completedCourses,
        ongoingCourses,
      },

      studentStats: {
        topEnrolledStudents, // array of { id, name, email, coursesEnrolled }
        recentEnrollments,    // array of { student_id, student_name, course_id, course_name, enrolled_at }
      },

      scholarStats: {
        topScholars, // array of { id, name, avgMarks, subjectsCount }
      },

      facultyStats: {
        mostExperiencedFaculties, // array of { id, name, qualifications, experienceYears, imageUrl }
      },
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    return res.status(500).json({ message: "Server error while fetching dashboard data" });
  }
});

// ===============================
// 📌 STUDENT DASHBOARD DATA
// ===============================
router.get("/students", verifyAuthStudent, async (req, res) => {
  const studentId = req.student.studentId; // from verifyAuthStudent
  // console.log(studentId);

  try {
    /* 1️⃣ Validate the email matches the logged-in student */
    const studentRecord = await sql`
      SELECT * FROM students WHERE id = ${studentId};
    `;

    if (studentRecord.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    const student = studentRecord[0];

    /* 2️⃣ Count enrolled courses */
    const enrolledCountResult = await sql`
      SELECT COUNT(*) AS count
      FROM student_courses
      WHERE student_id = ${student.id};
    `;

    const enrolledCount = Number(enrolledCountResult[0].count);

    /* 3️⃣ Fetch enrolled course names */
    const enrolledCourses = await sql`
      SELECT c.id, c.name
      FROM student_courses sc
      JOIN courses c ON c.id = sc.course_id
      WHERE sc.student_id = ${student.id}
      ORDER BY c.name ASC;
    `;

    /* 4️⃣ Respond with dashboard data */
    res.json({
      message: "Dashboard data fetched successfully",
      student: {
        id: student.id,
        name: student.name,
        email: student.email,
        status: student.status,
        created_at: student.created_at,
        last_login_at: student.last_login_at,
      },
      totalCourses: enrolledCount,
      courses: enrolledCourses,
    });

  } catch (err) {
    console.error("Dashboard fetch error:", err);
    res.status(500).json({ message: "Server error fetching dashboard" });
  }
});

export default router;
