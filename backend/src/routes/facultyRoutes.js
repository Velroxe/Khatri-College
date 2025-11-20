import express from "express";
import { verifyAuthAdmin } from "../middleware/authMiddleware.js";
import { sql } from "../db/index.js";

const router = express.Router();

/* =====================================================
   🧑‍🏫 CREATE FACULTY
   ===================================================== */
router.post("/", verifyAuthAdmin, async (req, res) => {
  try {
    const { name, qualifications, description, specialities, experience_years, image_url } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Faculty name is required" });
    }

    const result = await sql`
      INSERT INTO faculties (name, qualifications, description, specialities, experience_years, image_url)
      VALUES (${name}, ${qualifications}, ${description}, ${specialities}, ${experience_years}, ${image_url})
      RETURNING *;
    `;

    res.status(201).json({ message: "Faculty created successfully", faculty: result[0] });
  } catch (err) {
    console.error("Error creating faculty:", err);
    res.status(500).json({ message: "Server error creating faculty" });
  }
});

/* =====================================================
   📄 GET ALL FACULTIES
   ===================================================== */
router.get("/", async (req, res) => {
  try {
    const faculties = await sql`SELECT * FROM faculties ORDER BY created_at DESC;`;
    res.json(faculties);
  } catch (err) {
    console.error("Error fetching faculties:", err);
    res.status(500).json({ message: "Server error fetching faculties" });
  }
});

/* =====================================================
   📄 GET SINGLE FACULTY BY ID
   ===================================================== */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const faculty = await sql`SELECT * FROM faculties WHERE id = ${id};`;

    if (faculty.length === 0)
      return res.status(404).json({ message: "Faculty not found" });

    res.json(faculty[0]);
  } catch (err) {
    console.error("Error fetching faculty:", err);
    res.status(500).json({ message: "Server error fetching faculty" });
  }
});

/* =====================================================
   ✏️ UPDATE FACULTY
   ===================================================== */
router.put("/:id", verifyAuthAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, qualifications, description, specialities, experience_years, image_url } = req.body;

    const updated = await sql`
      UPDATE faculties
      SET 
        name = COALESCE(${name}, name),
        qualifications = COALESCE(${qualifications}, qualifications),
        description = COALESCE(${description}, description),
        specialities = COALESCE(${specialities}, specialities),
        experience_years = COALESCE(${experience_years}, experience_years),
        image_url = COALESCE(${image_url}, image_url),
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *;
    `;

    if (updated.length === 0)
      return res.status(404).json({ message: "Faculty not found" });

    res.json({ message: "Faculty updated successfully", faculty: updated[0] });
  } catch (err) {
    console.error("Error updating faculty:", err);
    res.status(500).json({ message: "Server error updating faculty" });
  }
});

/* =====================================================
   ❌ DELETE FACULTY
   ===================================================== */
router.delete("/:id", verifyAuthAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await sql`DELETE FROM faculties WHERE id = ${id} RETURNING *;`;
    if (deleted.length === 0)
      return res.status(404).json({ message: "Faculty not found" });

    res.json({ message: "Faculty deleted successfully" });
  } catch (err) {
    console.error("Error deleting faculty:", err);
    res.status(500).json({ message: "Server error deleting faculty" });
  }
});

export default router;
