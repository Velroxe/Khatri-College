import express from "express";
import { sql } from "../db/index.js";
import { verifyAuthAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * CLEANUP ENDPOINT
 * Deletes:
 *  - expired student_otps
 *  - expired admin_otps
 *  - expired student_refresh_tokens
 *  - expired admin refresh_tokens
 */
router.delete("/", verifyAuthAdmin, async (req, res) => {
  try {
    const now = new Date();

    // Delete expired student OTPs
    const studentOTPDelete = await sql`
      DELETE FROM student_otps
      WHERE expires_at < ${now};
    `;

    // Delete expired admin OTPs
    const adminOTPDelete = await sql`
      DELETE FROM admin_otps
      WHERE expires_at < ${now};
    `;

    // Delete expired student refresh tokens
    const studentRefreshDelete = await sql`
      DELETE FROM student_refresh_tokens
      WHERE expires_at < ${now};
    `;

    // Delete expired admin refresh tokens
    const adminRefreshDelete = await sql`
      DELETE FROM refresh_tokens
      WHERE expires_at < ${now};
    `;

    return res.json({
      success: true,
      message: "Cleanup completed",
      deleted: {
        studentOTPs: studentOTPDelete.count ?? studentOTPDelete.length,
        adminOTPs: adminOTPDelete.count ?? adminOTPDelete.length,
        studentRefreshTokens:
          studentRefreshDelete.count ?? studentRefreshDelete.length,
        adminRefreshTokens:
          adminRefreshDelete.count ?? adminRefreshDelete.length,
      },
    });
  } catch (error) {
    console.error("Cleanup error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during cleanup",
    });
  }
});

export default router;
