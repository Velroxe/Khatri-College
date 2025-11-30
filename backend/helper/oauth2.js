import { google } from "googleapis";
import "dotenv/config";

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI; // e.g. http://localhost:3000/oauth2callback

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

const SCOPES = [
  "https://www.googleapis.com/auth/drive.file",
  "https://www.googleapis.com/auth/gmail.send"
];

async function generateUrl() {

  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",   // <-- REQUIRED to get a refresh token
    prompt: "consent",        // <-- REQUIRED if you’ve already authorized before
    scope: SCOPES,
  });

  console.log("👉 Open this URL in your browser:\n");
  console.log(authUrl);
}

generateUrl();

const CODE = "";

async function getTokens() {
  try {
    const { tokens } = await oAuth2Client.getToken(CODE);
    console.log("✅ Tokens received:\n", tokens);
  } catch (err) {
    console.error("❌ Error exchanging code:", err.response?.data || err.message);
  }
}

// getTokens();