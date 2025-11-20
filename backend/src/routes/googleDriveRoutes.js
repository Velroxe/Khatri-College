import express from "express";
import { google } from "googleapis";
import "dotenv/config";
import { verifyAuthAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

// API: Get short-lived access token
router.get("/token", verifyAuthAdmin, async (req, res) => {
  try {
    const { token } = await oAuth2Client.getAccessToken();
    res.json({ access_token: token });
  } catch (err) {
    console.error("❌ Failed to get access token:", err.message);
    res.status(500).json({ error: "Failed to get access token" });
  }
});

export default router;
