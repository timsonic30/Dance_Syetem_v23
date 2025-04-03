const mongoose = require("mongoose");
const { Schema } = mongoose;

//課程collection部份
const danceClassSchema = new Schema({
  code: String,
  type: {
    type: String,
    enum: [
      "Class Type",
      "Regular Class",
      "Pop Up Class",
      "Workshop Class",
      "Showcase Class",
      "Other Class",
    ],
  },
  style: {
    type: String,
    enum: [
      "Dance Type",
      "Heels Dance",
      "Chair Dance",
      "Jazz Funk",
      "Twerk",
      "Hip Hop",
      "House",
      "Poping",
      "Locking",
      "Girls Hip Hop",
      "Urban",
      "Conternporary",
      "Waacking",
      "K-pop",
      "Breaking",
    ],
  },
  teacher: String,
  vacancy: String,
  status: {
    type: String,
    enum: ["Status", "招收中", "已取消", "額滿"],
    default: "招收中",
  },
  level: { type: String, enum: ["Level", "beginner", "Open style"] },
  date: { type: Date },
  startTime: {
    type: String,
    enum: [
      "",
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
      "",
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
  description: String,
  price: { type: Number },
  lessonDuration: [{ type: Date }],
  room: { type: String, enum: ["Room Type", "Room X", "Room L", "Room XL"] },
  performanceDay: { type: Date },
  img: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// 添加 pre-save 中間件
danceClassSchema.pre("save", function (next) {
  const { startTime, endTime } = this;
  console.log(startTime, endTime);

  // 將時間轉換為分鐘進行比較
  const timeToMinutes = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  if (timeToMinutes(endTime) < timeToMinutes(startTime)) {
    return next(
      new Error("請查看課程開始時間和結束時間，結束時間應該在開始時間之後")
    );
  }

  next(); // 驗證通過，繼續保存
});

const DanceClass = mongoose.model("DanceClass", danceClassSchema);

module.exports = DanceClass;

// 建立object及save到mongodb的範例
// const newDanceClass = new DanceClass({
//   code: "CLS905",
//   type: "Other Class",
//   style: "Girls Hip Hop",
//   teacher: "67d3ed811cc1f316f7a2748a",
//   vacancy: "7",
//   status: "招收中",
//   level: "beginner",
//   date: new Date("2025-04-28"),
//   startTime: "09:00",
//   endTime: "11:30",
//   description:
//     "A fun and empowering Girls Hip Hop class designed for beginners.",
//   price: 3200,
//   lessonDuration: [
//     new Date("2025-04-28T09:00:00"),
//     new Date("2025-04-28T11:30:00"),
//   ],
//   room: "Room X",
//   performanceDay: new Date("2025-05-25"),
//   img: "https://cdn.midjourney.com/59d8c800-32ad-45e1-ba4e-52803eaa9b4b/0_1.png",
//   createdAt: new Date(),
// });

// newDanceClass
//   .save()
//   .then((savedDoc) => {
//     console.log("儲存完畢, 資料是:");
//     console.log(savedDoc);
//   })
//   .catch((e) => {
//     console.log(e);
//   });
