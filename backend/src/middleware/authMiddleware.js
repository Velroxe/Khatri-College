import jwt from "jsonwebtoken";
import { sql } from "../db/index.js";
import crypto from "crypto";
import { generateAccessToken, generateRefreshToken, setAuthCookies } from "../utils/authUtils.js";

export const verifyAuthAdmin = async (req, res, next) => {
  try {
    const accessToken = req.cookies.admin_access_token;
    const refreshToken = req.cookies.admin_refresh_token;

    // If no tokens at all — unauthorized
    if (!accessToken && !refreshToken) {
      return res.status(401).json({ message: "Unauthorized: No tokens provided" });
    }

    // ✅ 1. Try to verify Access Token first
    if (accessToken) {
      try {
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
        // console.log(decoded);
        req.admin = decoded;
        return next();
      } catch (err) {
        console.log(err, err.name);
        if (err.name !== "TokenExpiredError") {
          // Invalid token, not just expired
          return res.status(401).json({ message: "Invalid access token" });
        }
      }
    }

    // ✅ 2. If Access Token expired, check Refresh Token
    if (!refreshToken) {
      return res.status(401).json({ message: "Session expired. Please log in again." });
    }

    // Check if refresh token exists in DB and not expired
    const dbToken = await sql`
      SELECT * FROM refresh_tokens WHERE token = ${refreshToken};
    `;

    if (dbToken.length === 0) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const tokenRecord = dbToken[0];

    if (new Date(tokenRecord.expires_at) < new Date()) {
      // Expired refresh token
      await sql`DELETE FROM refresh_tokens WHERE token = ${refreshToken}`;
      return res.status(401).json({ message: "Refresh token expired. Please log in again." });
    }

    // ✅ 3. Get admin info and issue new tokens
    const admin = await sql`SELECT * FROM admins WHERE id = ${tokenRecord.admin_id}`;
    if (admin.length === 0) {
      return res.status(401).json({ message: "Admin not found" });
    }

    const user = admin[0];

    // Create new access token
    const newAccessToken = jwt.sign(
      { adminId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    // Optionally rotate refresh token for better security
    const newRefreshToken = crypto.randomBytes(64).toString("hex");
    const newRefreshExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    // Delete old refresh token and insert new one
    await sql`
      DELETE FROM refresh_tokens WHERE token = ${refreshToken};
    `;
    await sql`
      INSERT INTO refresh_tokens (admin_id, token, expires_at)
      VALUES (${user.id}, ${newRefreshToken}, ${newRefreshExpiry});
    `;

    // Set new cookies
    const isProd = process.env.NODE_ENV === "production";
    res.cookie("admin_access_token", newAccessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      domain: ".khatricollege.com",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("admin_refresh_token", newRefreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      domain: ".khatricollege.com",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Attach user info to req for the next handler
    req.admin = { adminId: user.id, email: user.email };

    console.log("🔁 Access token refreshed successfully for admin:", user.email);
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    res.status(500).json({ message: "Server error in authentication" });
  }
};

export const verifyAuthStudent = async (req, res, next) => {
  try {
    const accessToken = req.cookies.student_access_token;
    const refreshToken = req.cookies.student_refresh_token;

    if (!accessToken && !refreshToken) {
      return res.status(401).json({ message: "Unauthorized: No tokens provided" });
    }

    /* ======================================================
       🔹 1. ACCESS TOKEN CHECK
    ====================================================== */
    if (accessToken) {
      try {
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

        // Fetch student to check suspension
        const studentRecord = await sql`
          SELECT id, email, status FROM students WHERE id = ${decoded.studentId};
        `;

        if (studentRecord.length === 0) {
          return res.status(401).json({ message: "Student does not exist" });
        }

        // 🚫 Suspended student — reject
        if (studentRecord[0].status === "suspended") {
          return res.status(403).json({ message: "Your account is suspended" });
        }

        req.student = decoded;
        return next();

      } catch (err) {
        if (err.name !== "TokenExpiredError") {
          return res.status(401).json({ message: "Invalid access token" });
        }
      }
    }

    /* ======================================================
       🔹 2. ACCESS TOKEN EXPIRED → REFRESH TOKEN CHECK
    ====================================================== */

    if (!refreshToken) {
      return res.status(401).json({ message: "Session expired. Please log in again." });
    }

    const dbToken = await sql`
      SELECT * FROM student_refresh_tokens WHERE token = ${refreshToken};
    `;

    if (dbToken.length === 0) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const tokenRecord = dbToken[0];

    if (new Date(tokenRecord.expires_at) < new Date()) {
      await sql`
        DELETE FROM student_refresh_tokens WHERE token = ${refreshToken};
      `;
      return res.status(401).json({ message: "Refresh token expired. Please log in again." });
    }

    // Fetch student
    const student = await sql`
      SELECT * FROM students WHERE id = ${tokenRecord.student_id};
    `;

    if (student.length === 0) {
      return res.status(401).json({ message: "Student not found" });
    }

    const user = student[0];

    // 🚫 Suspended? Block completely
    if (user.status === "suspended") {
      return res.status(403).json({
        message: "Your account is suspended. Contact support."
      });
    }

    /* ======================================================
       🔹 3. ROTATE TOKENS (Student is valid)
    ====================================================== */

    const newAccessToken = generateAccessToken("student", {
      studentId: user.id,
      email: user.email,
    });

    const newRefreshToken = generateRefreshToken();
    const newRefreshExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await sql`
      DELETE FROM student_refresh_tokens WHERE token = ${refreshToken};
    `;
    await sql`
      INSERT INTO student_refresh_tokens (student_id, token, expires_at)
      VALUES (${user.id}, ${newRefreshToken}, ${newRefreshExpiry});
    `;

    setAuthCookies(res, newAccessToken, newRefreshToken);

    req.student = { studentId: user.id, email: user.email };

    console.log("🔁 Access token refreshed for student:", user.email);
    next();

  } catch (err) {
    console.error("Student auth middleware error:", err);
    res.status(500).json({ message: "Server error in student authentication" });
  }
};
