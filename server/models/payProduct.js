const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define the schema
const payProductSchema = new Schema({
  productName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  point: {
    type: Number,
    default: 0,
  },
  img: {
    type: String,
    default: "", // Added the 'img' field
  },  
  stock: {
    type: Number,
    default: 0||"N/A",
  },
  ValidDate: {
    type: Date,
    default: null, // Changed default to 'null'
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the model
const PayProduct = mongoose.model("PayProduct", payProductSchema);
module.exports = PayProduct;

// const bulkIncreaseStock = async (filterCondition, incrementBy) => {
//   try {
//     // 使用 updateMany 方法批量更新符合条件的产品
//     const result = await PayProduct.updateMany(
//       filterCondition, // 过滤条件，用于选择需要更新的产品
//       { $inc: { stock: incrementBy } }, // $inc 操作符递增库存
//     );

//     console.log("批量更新结果：", result);
//   } catch (error) {
//     console.error("批量更新库存时出错：", error.message);
//   } finally {
//     // 操作完成后关闭数据库连接
//     mongoose.connection.close();
//   }
// };

// // 示例用法
// const filterCondition = { point: { $lt: 0 } }; // 过滤条件：仅更新 point 小于0的产品
// const incrementBy = 150; // 每个产品的库存增加5
// bulkIncreaseStock(filterCondition, incrementBy);


// // Mock data
// const payProductData = [
//   {
//     productName: "signal Class",
//     description: "1 class",
//     price: 200,
//     point: 200,
//     img: "path/to/image1.jpg",
//     ValidDate: new Date("2025-05-24"),
//   },
//   {
//     productName: "5 Class",
//     description: "5 classes",
//     price: 825,
//     point: 825,
//     img: "path/to/image2.jpg",
//     ValidDate: new Date("2025-05-24"),
//   },
//   {
//     productName: "10 Class",
//     description: "10 classes",
//     price: 1450,
//     point: 1450,
//     img: "path/to/image4.jpg",
//     ValidDate: new Date("2025-05-24"),
//   },
//   {
//     productName: "15 Class",
//     description: "15 classes",
//     price: 1950,
//     point: 1950,
//     img: "path/to/image4.jpg",
//     ValidDate: new Date("2025-05-24"),
//   },
//   {
//     productName: "Monthly Pass",
//     description: "30 days to attend courses including workshops, pop-up courses, collab class*except Showcase",
//     price: 0,
//     point: 3200, // Negative points as per mock data
//     img: "path/to/image4.jpg",
//     ValidDate: null,
//   },
//   {
//     productName: "Xtra lab T-shirt",
//     description: "Our own Design T-shirt",
//     price: 0,
//     point: -300, // Negative points as per mock data
//     img: "path/to/image4.jpg",
//     ValidDate: null,
//   },
// ];

// // Save each product to the database
// payProductData.forEach((data) => {
//   const newPayProduct = new PayProduct(data);
//   newPayProduct
//     .save()
//     .then((savedDoc) => {
//       console.log("儲存完畢, 資料是:");
//       console.log(savedDoc);
//     })
//     .catch((e) => {
//       console.error("Error while saving:", e.message);
//     });
// });

// module.exports = PayProduct;