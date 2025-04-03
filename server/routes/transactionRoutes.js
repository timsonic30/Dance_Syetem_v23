//抓出工具
const express = require("express");
const router = express.Router();
const Transaction = require("../models/transaction");
const Authorization = require("../middlewares/authorization");
const DanceClass = require("../models/danceClass");
const RoomRental = require("../models/roomRental");
const PayProduct = require("../models/payProduct");

//====購買紀錄找資料, 去每個不同的collection找資料送回前端
router.get("/recordDetail/:collectionName", async (req, res) => {
  try {
    const { collectionName } = req.params; // 提取 collectionName
    const { detail } = req.query; // 提取 detail 作為查詢參數

    console.log("接收到的 collectionName:", collectionName);
    console.log("接收到的 detail:", detail);

    // 映射 collectionName 到具體的模型
    const modelMap = {
      DanceClass: DanceClass,
      RoomRental: RoomRental,
      PayProduct: PayProduct,
    };

    const Model = modelMap[collectionName]; // 根據 collectionName 獲取對應模型

    // 檢查是否存在對應的模型
    if (!Model) {
      return res
        .status(400)
        .send({ success: false, message: "無效的集合名稱" });
    }

    // 使用模型查詢資料
    const data = await Model.find({ _id: detail });
    res.status(200).send({ response: "ok", data });
  } catch (error) {
    console.error("處理請求時發生錯誤:", error);
    res.status(500).send({ success: false, message: "伺服器錯誤" });
  }
});

//====將有關這個userId的用戶的交易data找出來
router.get("/purchaseRecord/:userId", async (req, res) => {
  try {
    // 從 URL 參數中獲取 userId
    const userId = req.params.userId;
    console.log("接收到的 userId:", userId);

    // 查詢 Transaction 資料
    const transactions = await Transaction.find({ userId: userId }).exec();

    // 如果查詢結果為空
    if (transactions.length === 0) {
      return res.status(404).send({ message: "未找到購買記錄" });
    }

    // 成功回應
    console.log(transactions);
    res.status(200).send({ response: "ok", transactions });
  } catch (error) {
    console.error("查詢購買記錄時發生錯誤:", error);
    res.status(500).send({ error: "伺服器錯誤，無法獲取購買記錄" });
  }
});
//==============================

//==========================================

// 從前端來的資料, 根據ID刪除danceClass collection中的資料
router.delete("/purchaseHistory/:id", async (req, res, next) => {
  const { id } = req.params;
  console.log(`刪除課程 ID: ${id}`);

  try {
    const deletedClass = await Transaction.findByIdAndDelete({ _id: id });
    if (!deletedClass) {
      return res
        .status(404)
        .send({ response: "error", message: "Class not found" });
    }
    console.log("刪除成功, 資料是:");
    console.log(deletedClass);
    res.send({ response: "ok", deletedClass });
  } catch (error) {
    console.error("刪除課程時發生錯誤:", error);
    res
      .status(500)
      .send({ response: "error", message: "Failed to delete class" });
  }
});
//==============================

//將shoppingCart傳來的資料傳入transaction的collection
router.post("/", async (req, res) => {
  const { type, detail, userId, price, status } = req.body;

  // 檢查欄位是否完整
  if (!type || !detail || !userId || !price || !status) {
    return res.status(400).send({ error: "請求資料不完整" });
  }

  const newTransaction = new Transaction({
    type: type.toLowerCase(), // 確保 type 為小寫
    detail: detail,
    userId: userId,
    price: price,
    status: status,
  });

  try {
    // 嘗試儲存資料
    const savedDoc = await newTransaction.save();
    console.log("儲存完畢, 資料是:", savedDoc);
    res.status(200).send({ response: "ok", transaction: savedDoc }); // 返回成功回應
  } catch (error) {
    // 錯誤處理
    console.error("儲存失敗:", error);
    res.status(500).send({ error: "儲存失敗，請稍後再試！" });
  }
});

module.exports = router;
