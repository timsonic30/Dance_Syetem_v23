const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Schema = mongoose.Schema;
const TeacherSchema = new Schema({
  username: {
    type: String,
    default: null,
  },
  nickname: {
    type: String,
    default: "teacher-" + Math.random().toString(36).substr(5, 14),
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 4,
  },
  gender: {
    type: String,
    enum: ["", "F", "M"],
    default: "",
  },
  dateOfBirth: {
    type: Date,
    default: null,
  },
  description: {
    type: String,
    default: "",
  },
  style: {
    type: String,
    default: "",
  },
  instagram: {
    type: String,
    default: "",
  },
  profilePic: {
    type: String,
    default:
      "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
  },
  point: {
    type: Number,
    default: 0,
  },
  role: {
    type: String,
    default: "teacher",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

TeacherSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

const Teacher = mongoose.model("Teacher", TeacherSchema, "teachers");

module.exports = Teacher;
