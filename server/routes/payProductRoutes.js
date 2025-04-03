const express = require("express");
const router = express.Router();
const PayProduct = require("../models/payProduct");

//請在這裡寫api

const Transaction = require("../models/transaction");
//const Member = require("../models/member");
//const Authorization = require("../middlewares/authorization")

//交給前端class資料
router.get("/", async (req, res, next) => {
  try {
    let payProductData = await PayProduct.find({}).exec();
    //console.log(classData);
    return res.send({ payProductData });
  } catch (e) {
    return res.send(e);
  }
});

// 返回collection的schema結構
router.get("/schema", (req, res, next) => {
  const schema = PayProduct.schema.paths;
  res.send({ schema });
});

// POST route to insert data
router.post("/createPayProduct", async (req, res) => {
  try {
    // Insert multiple products into the database
    const createdProducts = await PayProduct.insertMany(payProductData);

    // Respond with success message
    res.status(201).json({
      message: `${createdProducts.length} products inserted successfully`,
      data: createdProducts,
    });
  } catch (error) {
    console.error("Error inserting products:", error);

    // Respond with error message
    res.status(500).json({
      error: "Failed to insert products",
      details: error.message,
    });
  }
});

module.exports = router;
