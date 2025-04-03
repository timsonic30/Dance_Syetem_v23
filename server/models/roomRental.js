const mongoose = require("mongoose");
const { Schema } = mongoose;

// 租場 collection 部份
const roomRentalSchema = new Schema({
  roomType: {
    type: String,
    enum: ["Room X", "Room L", "Room XL"], // 可選的房間類型
    required: true,
  },
  date: {
    type: Date,
    required: true, // 日期必填
  },
  startTime: {
    type: String,
    enum: [
      "09:00",
      "09:30",
      "10:00",
      "10:30",
      "11:00",
      "11:30",
      "12:00",
      "12:30",
      "13:00",
      "13:30",
      "14:00",
      "14:30",
      "15:00",
      "15:30",
      "16:00",
      "16:30",
      "17:00",
      "17:30",
      "18:00",
      "18:30",
      "19:00",
      "19:30",
      "20:00",
      "20:30",
      "21:00",
      "21:30",
      "22:00",
      "22:30",
      "23:00",
    ],
  },
  endTime: {
    type: String,
    enum: [
      "09:00",
      "09:30",
      "10:00",
      "10:30",
      "11:00",
      "11:30",
      "12:00",
      "12:30",
      "13:00",
      "13:30",
      "14:00",
      "14:30",
      "15:00",
      "15:30",
      "16:00",
      "16:30",
      "17:00",
      "17:30",
      "18:00",
      "18:30",
      "19:00",
      "19:30",
      "20:00",
      "20:30",
      "21:00",
      "21:30",
      "22:00",
      "22:30",
      "23:00",
    ],
  },
  price: {
    type: Number,
    required: true,
  },
  userID: {
    type: String,
    required: true,
  },
  contactPerson: {
    type: String,
    required: true,
  },
  contactEmail: {
    type: String,
    required: true,
  },
  timeRange: {
    type: [String], // 時間範圍的數組，存儲具體時間段
  },
  rentalType: {
    type: String,
    enum: ["Class", "Private"], // 租賃類型
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, // 默認為當前時間
  },
  updatedAt: {
    type: Date,
    default: Date.now, // 默認為當前時間
  },
});

const RoomRental = mongoose.model("RoomRental", roomRentalSchema);

module.exports = RoomRental;
