const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Member = require("../models/member");
const Transaction = require("../models/transaction");
const DanceClass = require("../models/danceClass");
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");
require("dotenv").config();
const Authorization = require("../middlewares/authorization");
const RoleAuthorization = require("../middlewares/roleAuthorization");
const multer = require("multer");
const { uploadToS3 } = require("../config/s3Upload");

router.post("/information", Authorization, async (req, res, next) => {
  console.log("I am here");
  try {
    const user = await Member.findOne({ _id: new ObjectId(req.body.objectId) });
    console.log(user);
    return res.json({
      username: user.username,
      phone: user.phone,
      email: user.email,
      gender: user.gender,
      birthday: user.dateOfBirth,
      point: user.point,
      avatar: user.profilePic,
    });
  } catch (err) {
    throw new Error("Server Error");
  }
});

const upload = multer({ storage: multer.memoryStorage() });

router.post("/edit", Authorization, upload.any(), async (req, res, next) => {
  const objectId = req.user.objectId;
  const editField = req.body.editField; // Extract editField and objectId from the body
  let editValue;

  // Debug logs
  console.log("req.user:", req.user);
  console.log("req.body:", req.body);
  console.log("req.files:", req.files);

  // Handle profilePic (file upload)
  if (editField === "profilePic") {
    if (req.files && req.files.length > 0) {
      const file = req.files.find((f) => f.fieldname === "profilePic");
      editValue = await uploadToS3(file); // get the S3 url of the image
    } else {
      editValue = req.body.profilePic; // Use URL from req.body if no file
    }
  } else {
    editValue = req.body.editValue; // for Non-file fields
  }

  // console.log("I am editing", editField, editValue, objectId);
  const updateObject = { [editField]: editValue, updatedAt: new Date() };
  console.log(updateObject);
  try {
    const user = await Member.updateOne(
      { _id: new ObjectId(objectId) },
      { $set: updateObject }
    );
    console.log(user);
    return res.send({
      message: `Successfully update ${editField}`,
      value: editValue,
    });
  } catch (err) {
    console.log(err.message);
  }
});

router.post(
  "/getClassList",
  Authorization,
  RoleAuthorization("member"),
  async (req, res, next) => {
    const { objectId } = req.body;
    const regular = [],
      workshop = [],
      popUp = [],
      showcase = [];
    try {
      const classInfo = await Transaction.aggregate([
        {
          $match: {
            userId: objectId,
            type: "Class",
          },
        },
        {
          $lookup: {
            from: "danceclasses",
            let: { classId: { $toObjectId: "$detail" } },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$_id", "$$classId"] },
                },
              },
            ],
            as: "classDetails",
          },
        },
        {
          $unwind: {
            path: "$classDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 1,
            type: 1,
            detail: 1,
            userId: 1,
            price: 1,
            status: 1,
            classCode: "$classDetails.code",
            classLevel: "$classDetails.level",
            classType: "$classDetails.type",
            classStyle: "$classDetails.style",
            classTeacher: "$classDetails.teacher",
            classStartTime: "$classDetails.startTime",
            classEndTime: "$classDetails.endTime",
            classDate: "$classDetails.date",
            classRoom: "$classDetails.room",
            classImage: "$classDetails.img",
          },
        },
      ]);

      for (let classItem of classInfo) {
        // if (classItem.classType.toLowerCase().include(regular))
        //   regular.push(classItem);
        if (classItem.classType.toLowerCase().search("regular") !== -1)
          regular.push(classItem);
        else if (classItem.classType.toLowerCase().search("workshop") !== -1)
          workshop.push(classItem);
        else if (classItem.classType.toLowerCase().search("pop up") !== -1)
          popUp.push(classItem);
        else if (classItem.classType.toLowerCase().search("showcase") !== -1)
          showcase.push(classItem);
      }

      // Sorting classes by date
      regular.sort((a, b) => new Date(a.classDate) - new Date(b.classDate));
      workshop.sort((a, b) => new Date(a.classDate) - new Date(b.classDate));
      popUp.sort((a, b) => new Date(a.classDate) - new Date(b.classDate));
      showcase.sort((a, b) => new Date(a.classDate) - new Date(b.classDate));

      return res.send({ regular, workshop, popUp, showcase });
    } catch (err) {
      console.log(err.message);
    }
  }
);

router.post("/deleteClass", Authorization, async (req, res, next) => {
  const { transactionId, objectId } = req.body;
  try {
    const delRecord = await Transaction.deleteOne({
      _id: new ObjectId(transactionId),
    });
    console.log(delRecord);
    return res.send({ message: `Successfully delete the classes` });
  } catch (err) {
    console.log(err.message);
  }
});

module.exports = router;
