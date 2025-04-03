const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();

const transporter = require("../config/googleOAuth2Client");
const Member = require("../models/member");

const private_key =
  process.env.JWT_SECRET || "KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp";

router.get("/", async (req, res, next) => {
  console.log("I am here");
  res.send("Email sent successfully!");
});

// Define the route to send email
router.post("/verification", async (req, res, next) => {
  const { toEmail } = req.body;
  const emailTransporter = await transporter();

  const payload = { email: toEmail };
  const link =
    "http://localhost:3000/email/verification/" +
    jwt.sign({ payload }, private_key, {
      expiresIn: "1h",
    });

  try {
    await emailTransporter.sendMail({
      from: process.env.EMAIL,
      to: toEmail,
      subject: "Please verify your email address in XtraLab.",
      html: `<html>
  <body style="font-family: Arial, sans-serif; color: #333; padding: 20px; background-color: #f9f9f9;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
      <h2 style="color: #2c3e50;">Welcome to XtraLab!</h2>
      <p style="font-size: 16px; line-height: 1.5;">
        Thanks for signing up! We’re excited to have you on board. To get started, please verify your email address by clicking the button below:
      </p>
      <a href="${link}" style="display: inline-block; padding: 12px 24px; background-color: #3498db; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0;">
        Verify Your Email
      </a>
      <p style="font-size: 14px; color: #7f8c8d;">
        This link will expire in 1 hour. If you didn’t sign up for XtraLab, feel free to ignore this email.
      </p>
      <p style="font-size: 14px; margin-top: 30px;">
        Cheers,<br/>
        The XtraLab Team
      </p>
    </div>
  </body>
</html>`,
    });
    res.send("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Error sending email.");
  }
});

// debug to check if the google OAuth is valid
router.get("/send", async (req, res, next) => {
  const emailTransporter = await transporter();

  try {
    await emailTransporter.sendMail({
      from: process.env.EMAIL,
      to: process.env.EMAIL,
      subject: "Please verify your email address in XtraLab.",
      html: "This is my test",
    });
    res.send("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Error sending email.");
  }
});

const deleteRegistration = async (email) => {
  try {
    await Member.deleteOne({ email: email });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

router.get("/verification/:token", async (req, res, next) => {
  const { token } = req.params;
  console.log(token);

  try {
    const decoded = await new Promise((resolve, reject) => {
      jwt.verify(token, private_key, (error, decoded) => {
        if (error) {
          const decodedEmail = jwt.decode(token).payload.email;
          console.log(decodedEmail);
          deleteRegistration(decodedEmail);
          return reject(error);
        }
        resolve(decoded);
      });
    });

    const email = decoded.payload.email;

    const updateStatus = await Member.updateOne(
      { email: email },
      { $set: { status: true } }
    );

    if (!updateStatus.acknowledged) throw new Error("Database Server Error");

    res.send({ message: "The verification is completed", email: email });
  } catch (error) {
    console.log("Error during verification:", error.message);
    res.send({ message: "The link is expired or invalid" });
  }
});

module.exports = router;
