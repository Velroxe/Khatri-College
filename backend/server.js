import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";

import authAdminRoutes from "./src/routes/authAdminRoutes.js";
import authStudentRoutes from "./src/routes/authStudentRoutes.js";
import courseRoutes from "./src/routes/courseRoutes.js";
import studentRoutes from "./src/routes/studentRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";
import courseStudentsRoutes from "./src/routes/courseStudentsRoutes.js";
import courseDocumentRoutes from "./src/routes/courseDocumentRoutes.js";
import googleDriveRoutes from "./src/routes/googleDriveRoutes.js";
import documentRoutes from "./src/routes/documentRoutes.js";
import facultyRoutes from "./src/routes/facultyRoutes.js";
import scholarRoutes from "./src/routes/scholarRoutes.js";
import dashboardRoutes from "./src/routes/dashboardRoutes.js";
import clearOldDataRoutes from "./src/routes/clearOldDataRoutes.js";
import contactRoutes from "./src/routes/contactRoutes.js";

const app = express();

// app.use(cors());
app.use(express.json());
app.use(cookieParser()); // ✅ this is required

app.use((req, res, next) => {
  const allowedOrigins = [
    process.env.ADMIN_HOST,
    process.env.STUDENT_HOST,
    process.env.LANDING_PAGE_HOST,
  ];

  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

app.use((req, res, next) => {
  console.log("Incoming:", req.method, req.url);
  next();
});

app.use("/api/auth/admin", authAdminRoutes);
app.use("/api/auth/student", authStudentRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/courses", courseStudentsRoutes);
app.use("/api/courses", courseDocumentRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/admins", adminRoutes);
app.use("/api/google-drive", googleDriveRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/faculties", facultyRoutes);
app.use("/api/scholars", scholarRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/cleanup", clearOldDataRoutes);
app.use("/api/contact", contactRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
