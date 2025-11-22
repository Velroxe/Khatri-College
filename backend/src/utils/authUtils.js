import jwt from "jsonwebtoken";
import crypto from "crypto";
import bcrypt from "bcrypt";
import "dotenv/config";

const isProd = process.env.NODE_ENV === "production";

export function generateAccessToken(role, payload) {
  if (!role) throw new Error("Missing role for generateAccessToken");
  if (!payload) throw new Error("Missing payload for generateAccessToken");

  return jwt.sign(
    {
      role,        // 'admin' or 'student'
      ...payload,  // e.g. { adminId }, { studentId }
    },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
}

export function generateRefreshToken() {
  return crypto.randomBytes(64).toString("hex");
}

export function setAuthCookies(res, accessToken, refreshToken) {
  // Access Token Cookie — short-lived, HTTP-only
  res.cookie("student_access_token", accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    // domain: ".khatricollege.com",
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  // Refresh Token Cookie — long-lived, HTTP-only
  res.cookie("student_refresh_token", refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    // domain: ".khatricollege.com",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}

export const clearAuthCookies = (res) => {
  res.clearCookie("student_access_token", '', {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    // domain: ".khatricollege.com",
    path: '/',
    expires: new Date(0), // Expire immediately
  });

  res.clearCookie("student_refresh_token", '', {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    // domain: ".khatricollege.com",
    path: '/',
    expires: new Date(0), // Expire immediately
  });
};

export async function hashPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

export async function comparePassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

export function generateOTP() {
  // 6-digit numeric OTP
  return Math.floor(100000 + Math.random() * 900000).toString();
}