import express from "express";
import { sql } from "../db/index.js";
import { verifyAuthAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ======================================================
   CREATE SCHOLAR + SUBJECTS (ALL REQUIRED)
====================================================== */
router.post("/", verifyAuthAdmin, async (req, res) => {
  try {
    const { name, degree, image_url, subjects } = req.body;
    console.log(req.body);

    // VALIDATION
    if (!name) return res.status(400).json({ message: "Name is required" });
    if (!degree) return res.status(400).json({ message: "Degree is required" });
    if (!image_url) return res.status(400).json({ message: "Image URL is required" });

    if (!Array.isArray(subjects) || subjects.length === 0) {
      return res.status(400).json({ message: "At least one subject is required" });
    }

    for (const s of subjects) {
      if (!s.subject || s.marks == null) {
        return res.status(400).json({ message: "Each subject must have subject name and marks" });
      }
    }

    // create scholar
    const scholar = await sql`
      INSERT INTO scholars (name, degree, image_url)
      VALUES (${name}, ${degree}, ${image_url})
      RETURNING *;
    `;

    const scholarId = scholar[0].id;

    // insert subjects
    for (const s of subjects) {
      await sql`
        INSERT INTO scholar_top_subjects (scholar_id, subject_name, marks)
        VALUES (${scholarId}, ${s.subject}, ${s.marks});
      `;
    }

    res.json({ message: "Scholar created", scholar: scholar[0] });
  } catch (err) {
    console.error("Create scholar error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


/* ======================================================
   GET ALL SCHOLARS
====================================================== */
router.get("/", async (req, res) => {
  try {
    const scholars = await sql`SELECT * FROM scholars ORDER BY created_at DESC`;
    res.json(scholars);
  } catch (err) {
    console.error("Fetch scholars error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


/* ======================================================
   GET SCHOLAR WITH SUBJECTS
====================================================== */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const scholar = await sql`SELECT * FROM scholars WHERE id = ${id}`;
    if (scholar.length === 0)
      return res.status(404).json({ message: "Scholar not found" });

    const subjects = await sql`
      SELECT * FROM scholar_top_subjects WHERE scholar_id = ${id}
    `;

    res.json({
      ...scholar[0],
      subjects
    });
  } catch (err) {
    console.error("Error fetching scholar:", err);
    res.status(500).json({ message: "Server error" });
  }
});


/* ======================================================
   UPDATE SCHOLAR + SUBJECTS
====================================================== */
router.put("/:id", verifyAuthAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, degree, image_url, subjects } = req.body;

    // VALIDATION on update: only if field is provided, but for subjects it must not be empty array
    if (subjects) {
      if (!Array.isArray(subjects) || subjects.length === 0) {
        return res.status(400).json({ message: "At least one subject is required" });
      }

      for (const s of subjects) {
        if (!s.subject || s.marks == null) {
          return res.status(400).json({ message: "Each subject must have subject name and marks" });
        }
      }
    }

    // update scholar basic info
    const updated = await sql`
      UPDATE scholars
      SET 
        name = COALESCE(${name}, name),
        degree = COALESCE(${degree}, degree),
        image_url = COALESCE(${image_url}, image_url),
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *;
    `;

    if (updated.length === 0)
      return res.status(404).json({ message: "Scholar not found" });

    /* --------------------------
       UPDATE SUBJECTS
    --------------------------- */
    if (Array.isArray(subjects)) {
      const oldSubjects = await sql`
        SELECT id FROM scholar_top_subjects WHERE scholar_id = ${id}
      `;

      const oldIds = oldSubjects.map(s => s.id);
      const newIds = subjects.filter(s => s.id).map(s => s.id);

      // delete removed subjects
      for (const oldId of oldIds) {
        if (!newIds.includes(oldId)) {
          await sql`DELETE FROM scholar_top_subjects WHERE id = ${oldId}`;
        }
      }

      // add or update
      for (const s of subjects) {
        if (s.id) {
          await sql`
            UPDATE scholar_top_subjects
            SET subject_name = ${s.subject},
                marks = ${s.marks}
            WHERE id = ${s.id};
          `;
        } else {
          await sql`
            INSERT INTO scholar_top_subjects (scholar_id, subject_name, marks)
            VALUES (${id}, ${s.subject}, ${s.marks});
          `;
        }
      }
    }

    res.json({ message: "Scholar updated", scholar: updated[0] });
  } catch (err) {
    console.error("Update scholar error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


/* ======================================================
   DELETE SCHOLAR (cascade deletes subjects)
====================================================== */
router.delete("/:id", verifyAuthAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await sql`
      DELETE FROM scholars WHERE id = ${id} RETURNING *;
    `;

    if (deleted.length === 0)
      return res.status(404).json({ message: "Scholar not found" });

    res.json({ message: "Scholar deleted" });
  } catch (err) {
    console.error("Delete scholar error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
