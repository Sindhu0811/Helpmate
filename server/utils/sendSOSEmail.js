require("dotenv").config();
const nodemailer = require("nodemailer");

// LOCALHOST only
const BASE_URL = process.env.BASE_URL || "https://helpmate-production.up.railway.app";

/* ================= TRANSPORTER ================= */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Gmail App Password
  },
});

/* ================= SEND SOS EMAIL ================= */
const sendSOSEmail = async (contacts, userEmail, location) => {
  try {
    if (!contacts || contacts.length === 0) {
      console.log("❌ No emergency contacts to send");
      return false;
    }

    let locationHtml = `<p><b>📍 Live Location:</b> Not available</p>`;

    if (location && location.latitude && location.longitude) {
      const lat = location.latitude;
      const lng = location.longitude;
      const mapsLink = `https://www.google.com/maps?q=${lat},${lng}`;

      locationHtml = `
        <p><b>📍 Live Location:</b></p>
        <p>
          <a href="${mapsLink}" target="_blank" style="color:#2563eb; text-decoration:none;">
            📍 View on Google Maps
          </a>
        </p>
      `;
    }

    let successCount = 0;

    for (let c of contacts) {
      const receiverEmail = c.contactEmail || c.contactemail;
      const helperName = c.name || "Emergency Contact";

      if (!receiverEmail) {
        console.log("⚠️ Skipping contact with no email:", c);
        continue;
      }

      const encodedUserEmail = encodeURIComponent(userEmail);
      const encodedHelperName = encodeURIComponent(helperName);
      const encodedHelperEmail = encodeURIComponent(receiverEmail);

      const yesUrl = `${BASE_URL}/api/sos-response?userEmail=${encodedUserEmail}&helperName=${encodedHelperName}&helperEmail=${encodedHelperEmail}&response=yes`;
      const noUrl = `${BASE_URL}/api/sos-response?userEmail=${encodedUserEmail}&helperName=${encodedHelperName}&helperEmail=${encodedHelperEmail}&response=no`;
      const resolvedUrl = `${BASE_URL}/api/sos-resolved?userEmail=${encodedUserEmail}`;

      await transporter.sendMail({
        from: `HELPMATE SOS <${process.env.EMAIL_USER}>`,
        to: receiverEmail,
        subject: "🚨 HELPMATE SOS ALERT – Immediate Help Needed",
        html: `
<!DOCTYPE html>
<html>
  <body style="font-family:Arial, sans-serif; background:#f9fafb; padding:16px;">
    <div style="max-width:520px; margin:auto; background:white; border-radius:12px; padding:20px; box-shadow:0 10px 25px rgba(0,0,0,0.08);">

      <h2 style="color:#dc2626; margin-top:0;">🚨 HELPMATE Emergency Alert</h2>

      <p>Hello <b>${helperName}</b>,</p>

      <p>User <b>${userEmail}</b> has activated an SOS emergency alert and may be in danger.</p>

      ${locationHtml}

      <hr style="margin:20px 0;" />

      <p style="font-size:16px;"><b>Can you help right now?</b></p>

      <!-- ✅ YES Button -->
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:10px;">
        <tr>
          <td align="center" bgcolor="#16a34a" style="border-radius:8px;">
            <a href="${yesUrl}" 
               style="font-size:16px; font-weight:bold; color:#ffffff; text-decoration:none; padding:14px 0; display:inline-block; width:100%;">
              ✅ YES, I am available to help
            </a>
          </td>
        </tr>
      </table>

      <!-- ❌ NO Button -->
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:10px;">
        <tr>
          <td align="center" bgcolor="#dc2626" style="border-radius:8px;">
            <a href="${noUrl}" 
               style="font-size:16px; font-weight:bold; color:#ffffff; text-decoration:none; padding:14px 0; display:inline-block; width:100%;">
              ❌ NO, I am not available now
            </a>
          </td>
        </tr>
      </table>

      <!-- 🛟 RESOLVED Button -->
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td align="center" bgcolor="#2563eb" style="border-radius:8px;">
            <a href="${resolvedUrl}" 
               style="font-size:16px; font-weight:bold; color:#ffffff; text-decoration:none; padding:14px 0; display:inline-block; width:100%;">
              🛟 RESCUED / SITUATION RESOLVED
            </a>
          </td>
        </tr>
      </table>

      <hr style="margin:20px 0;" />

      <p style="font-size:12px; color:#6b7280;">
        This message was sent automatically by HELPMATE.<br/>
        If you cannot access the links, please contact the user directly.
      </p>

    </div>
  </body>
</html>
        `,
      });

      console.log("✅ SOS Email sent to:", receiverEmail);
      successCount++;
    }

    console.log(`✅ Total SOS Emails Sent: ${successCount}`);
    return successCount > 0;

  } catch (err) {
    console.error("❌ Failed to send SOS Emails:", err);
    return false;
  }
};

module.exports = sendSOSEmail;
