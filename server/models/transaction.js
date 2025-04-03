const mongoose = require("mongoose");
const { Schema } = mongoose;

//課程collection部份
const transactionSchema = new Schema(
  {
    type: {
      type: String,
      enum: [
        "Class",
        "Room Rental",
        "Package",
        "Tee",
        "class",
        "room rental",
        "package",
        "tee",
        "class",
        "room rental",
        "1 Class Package",
        "1 class package",
        "5 Class Package",
        "5 class package",
        "10 Class Package",
        "10 class package",
        "15 Class Package",
        "15 class package",
        "Monthly pass Package",
        "monthly pass package",
        "1 Piece Package",
        "1 piece package",
        "2 Piece Package",
        "2 piece package",
        "3 Piece Package",
        "3 piece package",
        "1 Room Package",
        "1 room package",
        "10 Room Package",
        "10 room package",
        "T-shirt",
        "t-shirt",
        "Ticket",
        "ticket",
        "Gift",
        "gift",
      ], // Allowed values
      required: true,
    },
    detail: {
      type: String,
      required: true,
    },
    userId: {
      type: String, // Assuming this is a reference to a user in your database
      required: true,
    },
    price: {
      type: String, // Consider using Number instead of String for better numeric calculations
      required: true,
    },
    status: {
      type: String,
      enum: ["Shopping Cart", "Pending Payment", "Paid"], // Transaction states
      default: "Shopping Cart", // Default status
    },
    attendance: {
      type: String,
      enum: ["None", "Attended", "Absent", "Sick Leaves"],
      default: "None",
    },
    createdAt: {
      type: Date,
      default: Date.now, // Automatically sets the creation date
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;

// 建立object及save到mongodb的範例
// const newTransaction = new Transaction({
//   type: 'Class',
//   detail: 'Room Rental ID',
//   userId: 'String',
//   price: '2300',
//   status: 'Shopping Cart'  }
// );

// newTransaction
//   .save()
//   .then((savedDoc) => {
//     console.log("儲存完畢, 資料是:");
//     console.log(savedDoc);
//   })
//   .catch((e) => {
//     console.log(e);
//   });
