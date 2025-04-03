const mongoose = require("mongoose");
const { Schema } = mongoose;
const Member = require("./member");

const shoppingCartSchema = new Schema(
  {
    productID: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    collectionName: {
      type: String,
      enum: ["danceclasses", "roomrentals", "payproducts"], // 根據需要列出可能的 collection
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    shoppingType: {
      type: String,
      enum: [
        "class",
        "room rental",
        "1 Class Package",
        "5 Class Package",
        "10 Class Package",
        "15 Class Package",
        "Monthly pass Package",
        "1 Piece Package",
        "2 Piece Package",
        "3 Piece Package",
        "1 Room Package",
        "10 Room Package",
        "T-shirt",
        "Ticket",
        "Gift",
      ], //資料from ws: 2025/3/26 15:19
      required: true,
    },
    userID: {
      type: Schema.Types.ObjectId,
      ref: "Member",
    },
    sessionID: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const ShoppingCart = mongoose.model("ShoppingCart", shoppingCartSchema);

// 創建新的購物車物件例子
// const newShoppingCart = new ShoppingCart({
//     productID: new mongoose.Types.ObjectId('67d685dbc56e0f17597cfb4e'), // 假設的 productID
//     collectionName: 'danceclasses', // 假設的 collectionName
//     price: 3000, // 假設價格
//     shoppingType: 'class', // 假設購物類型
//     userID: new mongoose.Types.ObjectId('67d1257e4d1fcb94294fb6af'), // 假設的 userID
//     sessionID: 'session20250325', // 假設的 session ID
//   });

// 將購物車物件存入資料庫例子
// newShoppingCart
//   .save()
//   .then((savedDoc) => {
//     console.log("儲存完畢, 資料是:");
//     console.log(savedDoc);
//   })
//   .catch((e) => {
//     console.log(e);
//   });

// 查詢並填充 userID 的資料例子
// ShoppingCart.find({ userID: '67d1257e4d1fcb94294fb6af' }) // 用指定的 userID 查詢
//   .populate({
//     path: 'userID', // 要填充的欄位（即 `userID`）
//     select: 'username', // 可選：只選擇特定欄位，如 name 和 email
//   })
//   .then(results => {
//     console.log('填充後的結果:', results);
//   })
//   .catch(err => {
//     console.error('查詢或填充時出現錯誤:', err);
//   });

module.exports = ShoppingCart;
