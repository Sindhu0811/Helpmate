const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendOtpEmail = async (email, otp) => {
  await transporter.sendMail({
    from: `HELPMATE <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "HELPMATE OTP Verification – Do Not Share",
    html: `
      <p>Hello User,</p>

      <p>Welcome to <b>HELPMATE</b>!</p>

      <p>Here is your One-Time Password (OTP):</p>

      <h1>${otp}</h1>

      <p>This code is valid for the next <b>10 minutes</b>.</p>

      <p>⚠️ <b>Please do not share this code with anyone</b> — not even HELPMATE support.<br/>
      We will never ask you for your OTP or password.</p>

      <p>If you did not request this OTP, you can safely ignore this email.</p>

      <p>Thanks,<br/>HELPMATE Team</p>
    `
  });
};

module.exports = sendOtpEmail;