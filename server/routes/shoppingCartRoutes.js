const express = require("express");
const router = express.Router();
const ShoppingCart = require("../models/shoppingCart");
const Authorization = require("../middlewares/authorization");
const DanceClass = require("../models/danceClass");
const Transaction = require("../models/transaction");
const RoomRental = require("../models/roomRental");
const PayProduct = require("../models/payProduct");
const { isObjectIdOrHexString } = require("mongoose");

//====用token找出member role和member object id
router.post('/tokenGetMember', Authorization, async (req, res) => {
    console.log('/tokenGetMember : memberdata:XXX', req.body)
    try {
        const { objectId,role } = req.body;
        console.log('/tokenGetMember : req.body', objectId);
 
        console.log("即將回傳成功回應");
        res.status(200).send({ response: "ok", objectId,role}); // 回應成功
    } catch (error) {
        console.error("Error processing request:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})
//=====================================


//==================================================
//tutor-BookThisClassButton, data輸入db
router.post("/addtocart", async (req, res) => {
    try {
        const { productID, collectionName, price, shoppingType, sessionID } = req.body;
        //創建新的購物車物件例子
        const newShoppingCart = new ShoppingCart({
            productID,
            collectionName,
            price,
            shoppingType,
            sessionID,
        });
        newShoppingCart
            .save()
            .then((savedDoc) => {
                res.status(201).send({ response: 'ok', savedDoc });
            })
            .catch((e) => {
                console.error('Error saving document:', e);
                res.status(500).send({ error: 'Failed to save document.' });
            });
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).send({ error: 'Failed to save data.' });
    }
});

//==================================================
//顯示shoppingcart collection資料
router.get("/getcart/:sessionID", async (req, res) => {
    try {
        const { sessionID } = req.params;
        const shoppingCart = await ShoppingCart.find({ sessionID });
        res.status(200).send(shoppingCart);
    } catch (error) {
        console.error('Error getting data:', error);
        res.status(500).send({ error: 'Failed to get data.' });
    }
})

//==========================================
//根據現時shopping cart裡面的item去找資料
router.post('/cartdata/:collectionName', async (req, res) => {
    const { collectionName } = req.params; // Get collectionName from URL
    const { productID, ShoppingCartid } = req.body;       // Get productID from request body    
    console.log('collectionName from DB:', collectionName);
    console.log('productID from DB:', productID);

    const modelMapping = {
        danceclasses: DanceClass,
        roomrentals: RoomRental,
        payproducts: PayProduct
    };

    try {
        const conllectionMap = modelMapping[collectionName];
        const results = await conllectionMap.find({
            _id: productID
        });

        if (results.length === 0) {
            console.log('找不到資料')
            return res.status(404).json({ response: 'ok', message: 'No data found for the given collectionName and productID' });
        }
        console.log('找到資料')
        res.status(200).json({ response: 'ok', data: results, shoppingCartid: ShoppingCartid });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

//==================================================
//刪除shopping cart裡面的item
router.delete("/delete/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deletedItem = await ShoppingCart.findByIdAndDelete(id);
        if (!deletedItem) {
            return res.status(404).send({ error: "Item not found" });
        }
        res.status(200).send(deletedItem);
    } catch (error) {
        console.error('Error deleting data:', error);
        res.status(500).send({ error: 'Failed to delete data.' });
    }
})


//==================================================
// 創建新的購物車物件例子
// const newShoppingCart = new ShoppingCart({
//     productID: new mongoose.Types.ObjectId('67d685dbc56e0f17597cfb4e'), // 假設的 productID
//     collectionName: 'danceclasses', // 假設的 collectionName
//     price: 3000, // 假設價格
//     shoppingType: 'class', // 假設購物類型
//     userID: new mongoose.Types.ObjectId('67d1257e4d1fcb94294fb6af'), // 假設的 userID
//     sessionID: 'session20250325', // 假設的 session ID
//   });
//==================================================
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
//==================================================



//請在這裡寫api






module.exports = router;