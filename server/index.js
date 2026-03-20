require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const { Pool } = require("pg");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const sendOtpEmail = require("./utils/sendEmail");
const sendSOSEmail = require("./utils/sendSOSEmail");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ---------- DATABASE ---------- */
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "demo1",
  password: "2007",
  port: 5432,
});

/* ---------- MULTER ---------- */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  },
});
const upload = multer({ storage });

app.get("/", (req, res) => res.send("Server running"));

/* ================= AUTH ================= */

app.get("/auth/me", async (req, res) => {
  try {
    const { email } = req.query;
    const result = await pool.query(
      "SELECT full_name, email, phone, city, state, pincode, country, profile_image FROM users WHERE email=$1",
      [email]
    );
    if (!result.rows[0])
      return res.status(404).json({ message: "User not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/signup", async (req, res) => {
  try {
    const { full_name, email, phone, password } = req.body;
    if (!full_name || !email || !phone || !password)
      return res.status(400).json({ message: "Missing fields" });

    const userExists = await pool.query(
      "SELECT id FROM users WHERE email=$1",
      [email]
    );
    if (userExists.rows.length > 0)
      return res.status(400).json({ message: "User already exists" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 5 * 60 * 1000);

    await pool.query(
      "INSERT INTO email_otps (email, otp, expires_at) VALUES ($1,$2,$3)",
      [email, otp, expiry]
    );

    await sendOtpEmail(email, otp);
    res.json({ message: "OTP sent to email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/verify-otp", async (req, res) => {
  try {
    const { full_name, email, phone, password, otp } = req.body;

    const otpResult = await pool.query(
      "SELECT * FROM email_otps WHERE email=$1 ORDER BY id DESC LIMIT 1",
      [email]
    );

    const record = otpResult.rows[0];
    if (!record) return res.status(400).json({ message: "OTP not found" });
    if (record.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });
    if (new Date() > record.expires_at)
      return res.status(400).json({ message: "OTP expired" });

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO users (full_name,email,phone,password,is_verified)
       VALUES ($1,$2,$3,$4,true)`,
      [full_name, email, phone, hashedPassword]
    );

    res.json({ message: "Signup successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    const user = result.rows[0];
    if (!user)
      return res.status(401).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ message: "Invalid credentials" });

    if (!user.is_verified)
      return res.status(401).json({ message: "Verify email first" });

    res.json({
      message: "Login successful",
      user: {
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
        city: user.city,
        state: user.state,
        country: user.country,
        pincode: user.pincode,
        profile_image: user.profile_image,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= PROFILE ================= */

app.put("/profile/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const {
      country,
      state,
      city,
      pincode,
      profile_image,
      phone,
      full_name,
    } = req.body;

    await pool.query(
      `UPDATE users SET country=$1, state=$2, city=$3, pincode=$4,
       profile_image=$5, phone=$6, full_name=$7 WHERE email=$8`,
      [country, state, city, pincode, profile_image || "", phone, full_name, email]
    );

    res.json({ message: "Profile updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/profile/upload/:email", upload.single("profileImage"), async (req, res) => {
  try {
    const { email } = req.params;
    const imagePath = `/uploads/${req.file.filename}`;

    await pool.query(
      "UPDATE users SET profile_image=$1 WHERE email=$2",
      [imagePath, email]
    );

    res.json({ profile_image: imagePath });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= EMERGENCY CONTACTS ================= */

// 1️⃣ Get all contacts for a user
app.get("/api/emergency-contacts", async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) return res.status(400).json({ message: "Email required" });

    const userRes = await pool.query("SELECT id FROM users WHERE email=$1", [email]);
    if (!userRes.rows[0]) return res.status(404).json({ message: "User not found" });

    const userId = userRes.rows[0].id;

    const contactsRes = await pool.query(
      `SELECT id, name, phone, relation, email AS contactEmail
       FROM emergency_contacts
       WHERE user_id=$1
       ORDER BY id DESC`,
      [userId]
    );

    res.json(contactsRes.rows);
  } catch (err) {
    console.error("Fetch contacts error:", err.stack);
    res.status(500).json({ message: "Failed to fetch contacts" });
  }
});


app.post("/api/emergency-contacts", async (req, res) => {
  console.log("🔥 ADD CONTACT API HIT");
  console.log("📦 Body received:", req.body);

  try {
    const { name, phone, relation, contactEmail, userEmail } = req.body;

    // Validate required fields
    if (!name || !phone || !userEmail) {
      console.log("❌ Missing required fields");
      return res.status(400).json({
        message: "Name, phone and userEmail are required",
      });
    }

    // Get user ID from users table
    const userRes = await pool.query(
      "SELECT id FROM users WHERE LOWER(TRIM(email)) = LOWER(TRIM($1))",
      [userEmail]
    );

    if (userRes.rows.length === 0) {
      console.log("❌ User not found in DB");
      return res.status(404).json({ message: "User not found" });
    }

    const userId = userRes.rows[0].id;
    console.log("✅ User ID found:", userId);

    // Insert contact
    const insertRes = await pool.query(
      `INSERT INTO emergency_contacts
       (user_id, name, phone, relation, email)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, phone, relation, email AS "contactEmail"`,
      [
        userId,
        name.trim(),
        phone.trim(),
        relation || "",
        contactEmail || null,
      ]
    );

    console.log("✅ Contact inserted:", insertRes.rows[0]);

    return res.status(201).json({
      message: "Contact added successfully",
      contact: insertRes.rows[0],
    });

  } catch (error) {
    console.error("💥 ERROR adding contact:", error);
    return res.status(500).json({
      message: "Server error while adding contact",
    });
  }
});


// 3️⃣ Update an existing contact
app.put("/api/emergency-contacts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, relation, contactEmail, userEmail } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Prevent updating contact to self
    if (contactEmail && userEmail && contactEmail.trim().toLowerCase() === userEmail.trim().toLowerCase()) {
      return res.status(400).json({ message: "You cannot set the contact email as your own email" });
    }

    const result = await pool.query(
      `UPDATE emergency_contacts
       SET name=$1, phone=$2, relation=$3, email=$4
       WHERE id=$5 RETURNING *`,
      [name, phone, relation || "", contactEmail || null, id]
    );

    if (!result.rows[0]) return res.status(404).json({ message: "Contact not found" });

    res.json({ message: "Contact updated", contact: result.rows[0] });
  } catch (err) {
    console.error("Update contact error:", err.stack);
    res.status(500).json({ message: "Server error" });
  }
});

// 4️⃣ Delete a contact
app.delete("/api/emergency-contacts/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM emergency_contacts WHERE id=$1 RETURNING *",
      [id]
    );

    if (!result.rows[0]) return res.status(404).json({ message: "Contact not found" });

    res.json({ message: "Contact deleted", contact: result.rows[0] });
  } catch (err) {
    console.error("Delete contact error:", err.stack);
    res.status(500).json({ message: "Server error" });
  }
});



/* ================= SOS SEND ================= */

app.post("/api/send-sos-emails", async (req, res) => {
  try {
    const { contacts, userEmail, location, alertType } = req.body;

    await pool.query(
      `INSERT INTO emergency_alerts (user_email, alert_type, status)
       VALUES ($1,$2,'alert_sent')`,
      [userEmail, alertType || "SOS"]
    );

    await pool.query(
      `INSERT INTO sos_active (user_email, active, status, helper_name, updated_at)
       VALUES ($1,true,'DANGER',NULL,NOW())
       ON CONFLICT (user_email)
       DO UPDATE SET
         active=true,
         status='DANGER',
         helper_name=NULL,
         updated_at=NOW()`,
      [userEmail]
    );

    res.json({ message: "SOS accepted", alertSent: true });

    sendSOSEmail(contacts, userEmail, location)
      .then((success) => console.log("📨 SOS emails sent:", success))
      .catch((err) => console.error("❌ SOS email error:", err));
  } catch (err) {
    console.error("❌ SOS API ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= HELPER RESPONSE ================= */

app.get("/api/sos-response", async (req, res) => {
  try {
    const { userEmail, helperName, helperEmail, response } = req.query;
    const clean = response?.trim().toLowerCase();

    if (!["yes", "no"].includes(clean)) {
      return res.send(renderStatusPage("Invalid Response", "Response not recognized.", "gray"));
    }

    await pool.query(
      `INSERT INTO sos_responses
       (user_email, helper_name, helper_email, response)
       VALUES ($1,$2,$3,$4)`,
      [userEmail, helperName, helperEmail, clean]
    );

    if (clean === "yes") {
      await pool.query(
        `UPDATE sos_active
         SET status='HELP_ON_WAY',
             helper_name=$1,
             updated_at=NOW()
         WHERE LOWER(TRIM(user_email)) = LOWER(TRIM($2))`,
        [helperName, userEmail]
      );

      await pool.query(
        `INSERT INTO emergency_alerts (user_email, alert_type, status)
         VALUES ($1,'HELP_ON_WAY','helper_accepted')`,
        [userEmail]
      );

      return res.send(
        renderStatusPage(
          "Help is on the way",
          `Thank you, ${helperName}. The user has been notified that you are coming to help.`,
          "green"
        )
      );
    }

    // NO
    // NO response
await pool.query(
  `UPDATE sos_active
   SET status='DANGER',
       helper_name=NULL,   -- clear helper name
       updated_at=NOW()
   WHERE LOWER(TRIM(user_email)) = LOWER(TRIM($1))`,
  [userEmail]
);


    await pool.query(
      `INSERT INTO emergency_alerts (user_email, alert_type, status)
       VALUES ($1,'HELP_DECLINED','helper_declined')`,
      [userEmail]
    );

    return res.send(
      renderStatusPage(
        "Marked as Unavailable",
        `Thank you, ${helperName}. The user will continue to seek other help.`,
        "red"
      )
    );

  } catch (err) {
    console.error("SOS RESPONSE ERROR:", err);
    return res.send(renderStatusPage("Server Error", "Something went wrong.", "gray"));
  }
});

/* ================= RESCUED ================= */

app.get("/api/sos-resolved", async (req, res) => {
  try {
    const { userEmail } = req.query;

    // Update status to SAFE
    await pool.query(
      `UPDATE sos_active
       SET status = 'SAFE',
           active = false,
           helper_name = NULL,
           updated_at = NOW()
       WHERE LOWER(TRIM(user_email)) = LOWER(TRIM($1))`,
      [userEmail]
    );

    await pool.query(
      `INSERT INTO emergency_alerts (user_email, alert_type, status)
       VALUES ($1,'RESCUED','safe')`,
      [userEmail]
    );

    return res.send(
      renderStatusPage(
        "Situation Resolved",
        "The SOS alert has been marked as resolved. The user is now safe.",
        "blue"
      )
    );
  } catch (err) {
    console.error("SOS RESOLVED ERROR:", err);
    return res.send(renderStatusPage("Server Error", "Failed to resolve SOS.", "gray"));
  }
});

/* ================= SOS STATUS ================= */

app.get("/api/sos-status", async (req, res) => {
  try {
    let { userEmail } = req.query;
    userEmail = userEmail.trim().toLowerCase();

    const result = await pool.query(
      `SELECT active, status, helper_name
       FROM sos_active
       WHERE LOWER(TRIM(user_email)) = $1`,
      [userEmail]
    );

    if (!result.rows.length) return res.json({ status: "SAFE" });

    const row = result.rows[0];

    if (!row.active || row.status === "SAFE") {
      return res.json({ status: "SAFE" });
    }

    if (row.status === "HELP_ON_WAY") {
      return res.json({
        status: "HELP_ON_WAY",
        helperName: row.helper_name
      });
    }

    return res.json({ status: "DANGER" });

  } catch (err) {
    console.error("SOS STATUS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch SOS status" });
  }
});

/* ================= UI HELPERS ================= */

function renderStatusPage(title, message, color) {
  const colors = {
    green: "#16a34a",
    red: "#dc2626",
    blue: "#2563eb",
    gray: "#6b7280",
  };
  const mainColor = colors[color] || colors.gray;

  return `
<!DOCTYPE html>
<html>
<head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;font-family:Arial;background:#f3f4f6;">
<div style="min-height:100vh;display:flex;align-items:center;justify-content:center;padding:16px;">
<div style="background:white;max-width:420px;width:100%;border-radius:16px;box-shadow:0 20px 40px rgba(0,0,0,0.1);overflow:hidden;">
<div style="background:${mainColor};padding:24px;text-align:center;">
<h1 style="margin:0;color:white;font-size:22px;">HELPMATE SOS</h1>
</div>
<div style="padding:28px;text-align:center;">
<div style="font-size:42px;margin-bottom:12px;">${color==="green"?"✅":color==="red"?"❌":"🛟"}</div>
<h2>${title}</h2>
<p>${message}</p>
<p style="font-size:12px;color:#6b7280;">You may close this window.</p>
</div>
</div>
</div>
</body>
</html>`;
}

/* ================= SERVER ================= */

const PORT = 5000;
app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
