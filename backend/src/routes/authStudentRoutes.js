import express from "express";
import bcrypt from "bcrypt";
import { sql } from "../db/index.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendEmailUsingGmailAPI } from "../utils/emailUtils.js";
import { verifyAuthStudent } from "../middleware/authMiddleware.js";

const router = express.Router();
const isProd = process.env.NODE_ENV === "production";

// ---------------- LOGIN WITH PASSWORD ----------------
router.post("/login-password", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await sql`
      SELECT * FROM students WHERE email = ${email};
    `;
    const student = result[0];

    if (!student) return res.status(404).json({ message: "Student not found" });

    const match = await bcrypt.compare(password, student.password_hash);
    if (!match) return res.status(401).json({ message: "Invalid password" });

    // Generate tokens
    const accessToken = jwt.sign(
      { studentId: student.id, email: student.email },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = crypto.randomBytes(64).toString("hex");
    const refreshExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    // Update last login + insert refresh token
    await sql.begin(async (tx) => {
      await tx`
        UPDATE students SET last_login_at = NOW() WHERE id = ${student.id};
      `;

      await tx`
        INSERT INTO student_refresh_tokens (student_id, token, expires_at)
        VALUES (${student.id}, ${refreshToken}, ${refreshExpiry});
      `;
    });

    // Set cookies
    res.cookie("student_access_token", accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      domain: ".khatricollege.com",
      maxAge: 15 * 60 * 1000, // 15 min
    });

    res.cookie("student_refresh_token", refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      domain: ".khatricollege.com",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      message: "Login successful",
      student: {
        id: student.id,
        name: student.name,
        email: student.email,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------- REFRESH TOKEN ----------------
router.post("/refresh", async (req, res) => {
  const refreshToken = req.cookies.student_refresh_token;
  if (!refreshToken)
    return res.status(401).json({ message: "Missing refresh token" });

  try {
    const result = await sql`
      SELECT * FROM student_refresh_tokens WHERE token = ${refreshToken};
    `;
    const record = result[0];

    if (!record)
      return res.status(403).json({ message: "Invalid refresh token" });

    if (new Date(record.expires_at) < new Date()) {
      await sql`DELETE FROM student_refresh_tokens WHERE token = ${refreshToken};`;
      return res.status(403).json({ message: "Expired refresh token" });
    }

    // Generate new access token
    const accessToken = jwt.sign(
      { studentId: record.student_id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    // Extend refresh token expiry (sliding window)
    const newExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await sql`
      UPDATE student_refresh_tokens SET expires_at = ${newExpiry} WHERE token = ${refreshToken};
    `;

    // Set cookies again
    res.cookie("student_access_token", accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      domain: ".khatricollege.com",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("student_refresh_token", refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      domain: ".khatricollege.com",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ message: "Token refreshed successfully" });
  } catch (err) {
    console.error("Refresh error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/me", async (req, res) => {
  const accessToken = req.cookies.student_access_token;
  const refreshToken = req.cookies.student_refresh_token;

  // console.log(accessToken, refreshToken);

  if (!accessToken && !refreshToken) {
    return res.status(401).json({ loggedIn: false, message: "Not authenticated" });
  }

  try {
    // ✅ Try verifying the access token
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    const [student] = await sql`
      SELECT id, name, email 
      FROM students 
      WHERE id = ${decoded.studentId};
    `;
    if (!student) return res.status(404).json({ loggedIn: false, message: "Student not found" });

    return res.json({ loggedIn: true, student });
  } catch (err) {
    // ❌ If access token is invalid or expired, try refreshing
    if (!refreshToken) return res.status(401).json({ loggedIn: false });

    try {
      const [record] = await sql`
        SELECT * FROM student_refresh_tokens WHERE token = ${refreshToken};
      `;

      if (!record || new Date(record.expires_at) < new Date()) {
        return res.status(401).json({ loggedIn: false, message: "Session expired" });
      }

      // 🔄 Issue new access token
      const newAccessToken = jwt.sign(
        { studentId: record.student_id },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
      );

      // 🕓 Sliding expiry window for refresh token
      const newExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      await sql`
        UPDATE student_refresh_tokens SET expires_at = ${newExpiry} WHERE token = ${refreshToken};
      `;

      // 🍪 Set updated cookies
      res.cookie("student_access_token", newAccessToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        domain: ".khatricollege.com",
        maxAge: 15 * 60 * 1000, // 15 min
      });

      res.cookie("student_refresh_token", refreshToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        domain: ".khatricollege.com",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      // ✅ Return student info
      const [student] = await sql`
        SELECT id, name, email FROM students WHERE id = ${record.student_id};
      `;
      if (!student) return res.status(404).json({ loggedIn: false, message: "Student not found" });

      const update = await sql`
        UPDATE students SET last_login_at = NOW() WHERE id = ${record.student_id};
      `;

      return res.json({ loggedIn: true, student });
    } catch (refreshErr) {
      console.error("Refresh in /me failed:", refreshErr);
      return res.status(500).json({ loggedIn: false, message: "Server error" });
    }
  }
});

router.post("/logout", async (req, res) => {
  try {
    const refreshToken = req.cookies.student_refresh_token;

    if (refreshToken) {
      // delete from DB to invalidate refresh
      await sql`DELETE FROM student_refresh_tokens WHERE token = ${refreshToken}`;
    }

    // clear cookies
    res.clearCookie("student_access_token", {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      domain: ".khatricollege.com",
    });

    res.clearCookie("student_refresh_token", {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      domain: ".khatricollege.com",
    });

    return res.json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================================
   1️⃣  SEND OTP (universal)
================================ */
router.post("/send-otp", async (req, res) => {
  const { email, purpose } = req.body;
  if (!email || !purpose)
    return res.status(400).json({ message: "Email and purpose are required" });

  try {
    const student = await sql`SELECT * FROM students WHERE email = ${email}`;
    if (student.length === 0)
      return res.status(404).json({ message: "Student not found" });

    // Generate a 6-digit OTP
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Delete any existing OTP for this purpose
    await sql`DELETE FROM student_otps WHERE email = ${email} AND purpose = ${purpose}`;

    // Save OTP
    await sql`
      INSERT INTO student_otps (email, otp, expires_at, purpose)
      VALUES (${email}, ${otp}, ${expiresAt}, ${purpose});
    `;

    // Generate subject & message body
    const subject =
      purpose === "forgot_password"
        ? "Reset Password OTP"
        : "Your student Login OTP";

    const htmlBody =
      purpose === "forgot_password"
        ? `
        <div style="font-family: Arial, sans-serif;">
          <h2>Reset Password OTP</h2>
          <p>Use the following OTP to reset your password:</p>
          <h1 style="letter-spacing: 3px; color: #2b5cff;">${otp}</h1>
          <p>This OTP will expire in <b>5 minutes</b>.</p>
        </div>
      `
        : `
        <div style="font-family: Arial, sans-serif;">
          <h2>Student Login OTP</h2>
          <p>Your one-time password for login is:</p>
          <h1 style="letter-spacing: 3px; color: #2b5cff;">${otp}</h1>
          <p>This OTP will expire in <b>5 minutes</b>.</p>
        </div>
      `;

    // Send email via Gmail REST API
    await sendEmailUsingGmailAPI(email, subject, htmlBody);

    res.json({ message: `OTP sent successfully for ${purpose}` });
  } catch (err) {
    console.error("Error sending OTP:", err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

/* ================================
   2️⃣  LOGIN WITH OTP
================================ */
router.post("/login-otp", async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp)
    return res.status(400).json({ message: "Email and OTP are required" });

  try {
    const purpose = "login";

    const result = await sql`
      SELECT * FROM student_otps
      WHERE email = ${email} AND otp = ${otp} AND purpose = ${purpose};
    `;
    const record = result[0];
    if (!record) return res.status(401).json({ message: "Invalid OTP" });

    if (new Date(record.expires_at) < new Date()) {
      await sql`DELETE FROM student_otps WHERE email = ${email} AND purpose = ${purpose}`;
      return res.status(401).json({ message: "OTP expired" });
    }

    // OTP valid → delete it (one-time use)
    await sql`DELETE FROM student_otps WHERE email = ${email} AND purpose = ${purpose}`;

    const student = await sql`SELECT * FROM students WHERE email = ${email}`;
    if (student.length === 0)
      return res.status(404).json({ message: "Student not found" });

    const user = student[0];

    // Tokens
    const accessToken = jwt.sign(
      { studentId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = crypto.randomBytes(64).toString("hex");
    const refreshExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await sql`
      INSERT INTO student_refresh_tokens (student_id, token, expires_at)
      VALUES (${user.id}, ${refreshToken}, ${refreshExpiry});
    `;

    // Set cookies
    res.cookie("student_access_token", accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      domain: ".khatricollege.com",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("student_refresh_token", refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      domain: ".khatricollege.com",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      message: "OTP login successful",
      student: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Login OTP error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================================
   🔐  FORGOT PASSWORD
================================ */
router.post("/forgot-password", async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword)
    return res
      .status(400)
      .json({ message: "Email, OTP, and new password are required" });

  try {
    // 1️⃣ Check OTP validity for purpose "forgot_password"
    const result = await sql`
      SELECT * FROM student_otps
      WHERE email = ${email} AND otp = ${otp} AND purpose = 'forgot_password';
    `;
    const record = result[0];
    if (!record) return res.status(401).json({ message: "Invalid OTP" });

    if (new Date(record.expires_at) < new Date()) {
      await sql`DELETE FROM student_otps WHERE email = ${email} AND purpose = 'forgot_password'`;
      return res.status(401).json({ message: "OTP expired" });
    }

    // 2️⃣ Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 3️⃣ Update password in DB
    await sql`
      UPDATE students
      SET password_hash = ${hashedPassword}
      WHERE email = ${email};
    `;

    // 4️⃣ Delete OTP (one-time use)
    await sql`DELETE FROM student_otps WHERE email = ${email} AND purpose = 'forgot_password'`;

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================================
   🔍 VERIFY OTP
================================ */
router.post("/verify-otp", async (req, res) => {
  const { email, otp, purpose } = req.body;
  if (!email || !otp || !purpose)
    return res
      .status(400)
      .json({ message: "Email, OTP, and purpose are required" });

  try {
    const result = await sql`
      SELECT * FROM student_otps
      WHERE email = ${email}
      AND otp = ${otp}
      AND purpose = ${purpose};
    `;

    const record = result[0];
    if (!record)
      return res.status(401).json({ valid: false, message: "Invalid OTP" });

    if (new Date(record.expires_at) < new Date()) {
      await sql`DELETE FROM student_otps WHERE email = ${email} AND purpose = ${purpose}`;
      return res.status(401).json({ valid: false, message: "OTP expired" });
    }

    res.json({ valid: true, message: "OTP verified successfully" });
  } catch (err) {
    console.error("Verify OTP error:", err);
    res.status(500).json({ valid: false, message: "Server error" });
  }
});

/* =====================================================
   🔒 CHANGE PASSWORD
   ===================================================== */
router.patch("/change-password", verifyAuthStudent, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const studentId = req.student.studentId; // verifyAuthStudent sets this

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: "Both old and new passwords are required." });
  }

  try {
    // 1️⃣ Fetch user
    const students = await sql`SELECT id, password_hash FROM students WHERE id = ${studentId}`;
    if (students.length === 0)
      return res.status(404).json({ message: "Student not found" });

    const student = students[0];

    // 2️⃣ Compare old password
    const isMatch = await bcrypt.compare(oldPassword, student.password_hash);
    if (!isMatch)
      return res.status(401).json({ message: "Old password is incorrect" });

    // 3️⃣ Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 4️⃣ Update password in DB
    await sql`
      UPDATE students SET password_hash = ${hashedPassword} WHERE id = ${studentId}
    `;

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Error changing password:", err);
    res.status(500).json({ message: "Server error while changing password" });
  }
});

export default router;