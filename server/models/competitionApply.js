const mongoose = require("mongoose");
const { Schema } = mongoose;

// 定义比赛申请的Schema
const competitionApplySchema = new Schema({
  crewName: {
    type: String, // 队伍名称
    required: true, // 必填字段
    trim: true, // 去除首尾空格
  },
  contactName: {
    type: String, // 联系人姓名
    required: true,
    trim: true,
  },
  contactNumber: {
    type: String, // 联系人电话
    required: true,
    trim: true,
    match: [/^\+852\d{8}$/, "请提供有效的香港电话号码（+852开头，后接8位数字）"], // 电话格式校验
  },
  instagram: {
    type: String, // Instagram 帐号
    required: true,
    trim: true,
  },
  category: {
    type: String, // 比赛类别
    required: true,
    enum: ["U12 (Choreography)", "U18 (Choreography)", "Open (Choreography)", "K-Pop (Cover)"], // 限定值
  },
  teamMembers: {
    type: Number, // 队伍人数
    required: true,
    min: [2, "队伍人数不能少于2人"], // 最小值校验
    max: [10, "队伍人数不能多于10人"], // 最大值校验
  },
  videoURL: {
    type: String, // 视频链接
    required: true,
    match: [/^(http|https):\/\/[^ "]+$/, "请使用有效的网址"], // URL格式校验
  },
  transactionSlip: {
    type: String, // 付款凭证文件路径或链接
    required: true,
  },
  createdAt: {
    type: Date, // 提交时间
    default: Date.now, // 默认值为当前时间
  },
});

// 创建Mongoose模型
const CompetitionApply = mongoose.model("CompetitionApply", competitionApplySchema);

// // Mock data
// const competitionApplyData = [
//   {
//     crewName: "Hot hot BB",
//     contactName: "Wong Wai Ting",
//     contactNumber: "+85212345678", // Valid phone number
//     instagram: "@hotbb", // Valid Instagram handle
//     category: "U12 (Choreography)", // Valid category
//     teamMembers: 3, // Valid team member count
//     videoURL: "https://example.com/video4.jpg", // Valid URL
//     transactionSlip: "/uploads/transaction_123.jpg", // Example file path
//   },
// ];

// // Save each application to the database
// competitionApplyData.forEach((data) => {
//   const newCompetitionApply = new CompetitionApply(data);
//   newCompetitionApply
//     .save()
//     .then((savedDoc) => {
//       console.log("儲存完畢, 資料是:");
//       console.log(savedDoc);
//     })
//     .catch((e) => {
//       console.error("保存数据时出错:", e.message);
//     });
// });

module.exports = CompetitionApply;
