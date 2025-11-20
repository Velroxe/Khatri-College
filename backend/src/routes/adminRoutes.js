import express from "express";
import bcrypt from "bcrypt";
import { sql } from "../db/index.js";
import { verifyAuthAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ================================
   🟢 CREATE ADMIN
================================ */
router.post("/", verifyAuthAdmin, async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email)
    return res.status(400).json({ message: "Name and email are required." });

  try {
    const existing = await sql`SELECT * FROM admins WHERE email = ${email}`;
    if (existing.length > 0)
      return res.status(409).json({ message: "Email already exists." });

    const passwordHash = await bcrypt.hash(password ? password : "password123", 10);

    const result = await sql`
      INSERT INTO admins (name, email, password_hash)
      VALUES (${name}, ${email}, ${passwordHash})
      RETURNING id, name, email, created_at;
    `;

    res.status(201).json({
      message: "Admin created successfully",
      admin: result[0],
    });
  } catch (err) {
    console.error("Create admin error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================================
   🟡 GET ALL ADMINS
================================ */
router.get("/", verifyAuthAdmin, async (req, res) => {
  try {
    const admins = await sql`
      SELECT id, name, email, created_at, updated_at, last_login_at
      FROM admins
      ORDER BY created_at DESC;
    `;
    res.json(admins);
  } catch (err) {
    console.error("Get admins error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================================
   🔵 GET SINGLE ADMIN
================================ */
router.get("/:id", verifyAuthAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await sql`
      SELECT id, name, email, created_at, updated_at, last_login_at
      FROM admins WHERE id = ${id};
    `;
    if (result.length === 0)
      return res.status(404).json({ message: "Admin not found" });

    res.json(result[0]);
  } catch (err) {
    console.error("Get admin error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================================
   🟠 UPDATE ADMIN
================================ */
router.put("/:id", verifyAuthAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  try {
    const existing = await sql`SELECT * FROM admins WHERE id = ${id}`;
    if (existing.length === 0)
      return res.status(404).json({ message: "Admin not found" });

    let passwordHash = existing[0].password_hash;
    if (password) {
      passwordHash = await bcrypt.hash(password, 10);
    }

    const updated = await sql`
      UPDATE admins
      SET 
        name = ${name || existing[0].name},
        email = ${email || existing[0].email},
        password_hash = ${passwordHash},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING id, name, email, updated_at;
    `;

    res.json({
      message: "Admin updated successfully",
      admin: updated[0],
    });
  } catch (err) {
    console.error("Update admin error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================================
   🔴 DELETE ADMIN (cannot delete all)
================================ */
router.delete("/:id", verifyAuthAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const countResult = await sql`SELECT COUNT(*) FROM admins;`;
    const adminCount = parseInt(countResult[0].count, 10);

    if (adminCount <= 1) {
      return res.status(400).json({
        message: "Cannot delete the last remaining admin.",
      });
    }

    const deleted = await sql`
      DELETE FROM admins WHERE id = ${id} RETURNING id;
    `;

    if (deleted.length === 0)
      return res.status(404).json({ message: "Admin not found" });

    res.json({ message: "Admin deleted successfully" });
  } catch (err) {
    console.error("Delete admin error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
