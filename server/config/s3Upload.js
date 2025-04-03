const express = require("express");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
require("dotenv").config();

const s3 = new S3Client({
  region: "ap-northeast-1", // Specify your region
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const uploadToS3 = async (file) => {
  try {
    const params = {
      Bucket: "erb-9-dance-platform", // 相簿位子
      Key: `user-avatar/${Date.now()}-${file.originalname}`, // 你希望儲存在 S3 上的檔案名稱
      Body: file.buffer, // 檔案
      ContentType: file.mimetype, // 副檔名
    };

    const command = new PutObjectCommand(params);
    const data = await s3.send(command);
    console.log("Upload Successful", data);

    const fileUrl = `https://${params.Bucket}.s3.amazonaws.com/${params.Key}`;
    return fileUrl;
  } catch (err) {
    console.error(err);
    return null;
  }
};

module.exports = { uploadToS3 };
