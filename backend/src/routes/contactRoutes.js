import express from "express";
import { sendEmailUsingGmailAPI } from "../utils/emailUtils.js";
import "dotenv/config";

const router = express.Router();

/**
 * Public POST /api/contact
 * Takes: name, phone, message
 * Sends email to admin inbox
 */
router.post("/", async (req, res) => {
  try {
    const { name, phone, message } = req.body;

    // Validations
    if (!name || !phone || !message) {
      return res.status(400).json({ message: "Name, phone, and message are required" });
    }

    const adminEmail = process.env.ADMIN_CONTACT_EMAIL;
    if (!adminEmail) {
      return res.status(500).json({ message: "Admin contact email not configured" });
    }

    const subject = "Contact Form Submission";

    // Email body
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333333; padding: 20px; background-color: #f4f4f4; border-radius: 8px;">
          
          <h2 style="color: #1a73e8; border-bottom: 2px solid #eeeeee; padding-bottom: 10px; margin-top: 0;">
              📝 New Contact Form Submission
          </h2>
          
          <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 20px; border-collapse: collapse;">
              <tr>
                  <td style="padding: 8px 0;">
                      <p style="margin: 0;">
                          <strong><span style="color: #555555;">Name:</span></strong> 
                          <span style="font-weight: normal; margin-left: 10px;">${name}</span>
                      </p>
                  </td>
              </tr>
              <tr>
                  <td style="padding: 8px 0;">
                      <p style="margin: 0;">
                          <strong><span style="color: #555555;">Phone:</span></strong> 
                          <span style="font-weight: normal; margin-left: 10px;">${phone}</span>
                      </p>
                  </td>
              </tr>
          </table>

          <div style="background-color: #ffffff; border: 1px solid #dddddd; padding: 15px; border-radius: 6px;">
              <p style="font-size: 1.1em; font-weight: bold; color: #333333; margin-top: 0;">
                  Message Details:
              </p>
              <p style="white-space: pre-wrap; margin-bottom: 0;">
                  ${message}
              </p>
          </div>
          
          <br />
          
          <p style="font-size: 0.8em; color: #999999; text-align: right; margin-bottom: 0;">
              Sent automatically from Contact Page System
          </p>

      </div>
      `;

    // Send using your helper
    await sendEmailUsingGmailAPI(adminEmail, subject, htmlBody);

    return res.json({ message: "Message sent successfully" });
  } catch (err) {
    console.error("Contact route error:", err);
    return res.status(500).json({ message: "Server error while sending message" });
  }
});

export default router;
