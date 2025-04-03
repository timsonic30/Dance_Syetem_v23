const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Member = require("../models/member");
const Teacher = require("../models/teacher");
const Staff = require("../models/staff");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

mongoose
  .connect(
    "mongodb+srv://wazine6513:Ab123456@erb.3et5k.mongodb.net/project?retryWrites=true&w=majority&appName=ERB"
  )
  .then(() =>
    console.log("Pinged your deployment. You successfully connected to MongoDB")
  )
  .catch((err) => console.error("MongoDB connection error:", err));

router.get("/", (req, res, next) => {
  //   console.log("I am here");
  res.send({ message: "Backend send back the data to you" });
});

router.post("/register", async (req, res, next) => {
  const { phone, email, password } = req.body;

  const errors = [];

  // Check if the phone number is already in used. If true, return the error to the frontend
  try {
    const existingPhone = await Member.findOne({ phone });
    console.log(existingPhone);
    if (existingPhone) {
      // return res.status(409).json({ error: "此用戶名已使用，請使用另一名稱" });
      errors.push("Duplicated phone number. Please choose a different number");
      // return res.status(409).json({ error: errors });
    }
  } catch (err) {
    console.error("Error while checking phone:", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }

  // Check if the email address is already in used. If true, return the error to the frontend
  try {
    const existingEmail = await Member.findOne({ email });
    console.log(existingEmail);
    if (existingEmail) {
      // return res.status(409).json({ error: "Email is already in use" });
      errors.push("Duplicated email. Please provide a different email address");
      // return res.status(409).json({ error: errors });
    }
  } catch (err) {
    console.error("Error while checking email:", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }

  if (errors.length > 0) return res.status(409).json({ errors });

  const NewMember = new Member({
    phone,
    email,
    password,
  });

  try {
    await NewMember.save();
    console.log("succeed to register new member!");

    const response = await fetch("http://localhost:3030/email/verification", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        toEmail: email,
      }),
    });

    if (!response.ok) {
      throw new Error("Email Server Error");
    }

    return res.status(201).json({ message: "Registration is completed" });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/login", async (req, res, next) => {
  const { userDetail, password } = req.body;
  console.log(userDetail, password);
  try {
    const user =
      (await Member.findOne({ phone: userDetail })) ||
      (await Member.findOne({ email: userDetail })) ||
      (await Teacher.findOne({ phone: userDetail })) ||
      (await Teacher.findOne({ email: userDetail })) ||
      (await Staff.findOne({ email: userDetail }));
    // console.log(user);
    if (!!user) {
      console.log("Pass1");
      const match = await bcrypt.compare(password, user.password);
      console.log(match);
      if (match) {
        console.log("Corrected Password");
        const payload = {
          objectId: user._id,
          role: user.role,
        };

        const private_key =
          process.env.JWT_SECRET || "KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp";

        const token = jwt.sign({ payload }, private_key, {
          expiresIn: "3d",
        });

        return res.status(200).json({
          message: "Login successful!",
          token: token,
          role: user.role,
        });
      } else {
        console.log("Wrong Password1");
        return res.status(403).json("Fail to login");
      }
    } else {
      console.log("Wrong Password2");
      return res.status(403).json("Fail to login");
    }
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/change", async (req, res, next) => {
  const objectId = "67d8d78d044f0146a5232076";
  const password = "Ab12";

  const salt = await bcrypt.genSalt(10);
  const encryptPW = await bcrypt.hash(password, salt);
  // Check if the phone number is already in used. If true, return the error to the frontend
  try {
    const user = await Member.updateOne(
      { _id: objectId },
      { $set: { password: encryptPW } }
    );
    console.log(user);
    if (user) {
      return res.send("Successful to update your password");
    }
  } catch (err) {
    console.error("Error while changing password:", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/reset-password", async (req, res, next) => {
  const { email, password } = req.body;

  encryptPW = await bcrypt.hash(password, 10);
  console.log(encryptPW);

  try {
    // const user2 = await Member.findOne({ email });
    // console.log(user2);
    const user = await Teacher.updateOne(
      { email: email },
      { $set: { password: encryptPW } }
    );
    console.log(user);
    if (!user) {
      return res.status(409).json({ error: "User not found" });
    }

    console.log("succeed to reset your password!");
    return res.status(201).json({ message: "Your password is reset" });
  } catch (err) {
    console.error("Error while resetting your password:", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
