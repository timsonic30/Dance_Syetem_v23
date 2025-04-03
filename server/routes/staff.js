const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Staff = require("../models/staff");
const Teacher = require("../models/teacher");
const Member = require("../models/member");

const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");
require("dotenv").config();
const Authorization = require("../middlewares/authorization");

router.post("/profile", Authorization, async (req, res, next) => {
  try {
    const user = await Staff.findOne({ _id: new ObjectId(req.body.objectId) });
    return res.json({
      username: user.username,
      email: user.email,
    });
  } catch (err) {
    throw new Error("Server Error");
  }
});

// Dummy code
router.post("/reg", async (req, res, next) => {
  const { username, email, password } = req.body;
  console.log(username, email, password);
  const NewStaff = new Staff({
    username,
    email,
    password,
  });

  try {
    await NewStaff.save();
    console.log("succeed to register new staff!");
    return res.status(201).json({ message: "Registration is completed" });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/teachers", async (req, res, next) => {
  try {
    const teacher = await Teacher.find();
    res.send({ result: teacher });
  } catch (err) {
    throw new Error("Server Error");
  }
});

router.get("/members", async (req, res, next) => {
  try {
    const member = await Member.find();
    res.send({ result: member });
  } catch (err) {
    throw new Error("Server Error");
  }
});

router.post("/members/edit", async (req, res, next) => {
  const { editField, editValue, identify } = req.body;
  const updateObject = { [editField]: editValue, updatedAt: new Date() };
  console.log("I am here", editField, editValue, identify);

  try {
    let member;
    if (editField === "email") {
      member = await Member.updateOne(
        { phone: identify },
        { $set: updateObject }
      );
    } else {
      member = await Member.updateOne(
        { email: identify },
        { $set: updateObject }
      );
    }
    res.send({ result: member });
  } catch (err) {
    throw new Error("Server Error");
  }
});

module.exports = router;
