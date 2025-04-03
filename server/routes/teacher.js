const express = require("express");
const router = express.Router();
const Teacher = require("../models/teacher");
const DanceClass = require("../models/danceClass");
const Transaction = require("../models/transaction");
const Member = require("../models/member");

const { ObjectId } = require("mongodb");
const Authorization = require("../middlewares/authorization");

router.post("/information", Authorization, async (req, res, next) => {
  const { objectId } = req.body;
  try {
    const user = await Teacher.findOne({
      _id: new ObjectId(objectId),
    });
    // console.log(user);
    return res.json({
      username: user.username,
      phone: user.phone,
      email: user.email,
      gender: user.gender,
      birthday: user.dateOfBirth,
      point: user.point,
      nickname: user.nickname,
      style: user.style,
      instagram: user.instagram,
      avatar: user.profilePic,
    });
  } catch (err) {
    throw new Error("Server Error");
  }
});

router.post("/edit", Authorization, async (req, res, next) => {
  const { editField, editValue, objectId } = req.body;
  // const ID = "67d3eb571cc1f316f7a27482";
  console.log(editField, editValue);
  const updateObject = { [editField]: editValue, updatedAt: new Date() };
  try {
    const user = await Teacher.updateOne(
      { _id: new ObjectId(objectId) },
      { $set: updateObject }
    );
    console.log(user);
    return res.send(`Successfully update ${editField}`);
  } catch (err) {
    throw new Error("Server Error");
  }
});

router.post("/getClassList", Authorization, async (req, res, next) => {
  let { type, objectId } = req.body;

  const presentClasses = [],
    oldClasses = [];
  const regularClass = [],
    popUpClass = [],
    workshopClass = [],
    showcaseClass = [],
    otherClass = [];
  try {
    const list = await DanceClass.find({ teacher: objectId });
    // const filterList = list.filter(
    //   (classItem) => classItem["type"] === "Workshop Class"
    // );
    // list.forEach((classItem) => {
    //   if (classItem["type"] === "Workshop Class") {
    //     //   // regularClass.push(classItem);
    //     //   // } else if (classItem["type"] === "Pop Up Class") {
    //     //   //   popUpClass.push(classItem);
    //     //   // } else if (classItem["type"] === "Workshop Class") {
    //     workshopClass.push(classItem);
    //     //   // } else if (classItem["type"] === "Showcase Class") {
    //     //   //   showcaseClass.push(classItem);
    //     //   // } else {
    //     //   //   otherClass.push(classItem);
    //     //   // }
    //   }
    // });

    // // Iterate through classes and separate into old and present
    // for (const classItem of filterList) {
    //   // Fetch transactions associated with the class using the code
    //   const transactions = await Transaction.find({ detail: classItem._id });
    //   // Fetch user details for each transaction
    //   const studentDetails = await Promise.all(
    //     transactions.map(async (transaction) => {
    //       const userDetails = await Member.findById(transaction.userId);
    //       return {
    //         // nickname: userDetails.nickname,
    //         email: userDetails.email,
    //         phone: userDetails.phone,
    //       };
    //     })
    //   );

    //   // Add the students to the class item
    //   classItem.students = studentDetails;
    // }

    const filterList = await Promise.all(
      list
        .filter((classItem) => classItem.type === type)
        .map(async (classItem) => {
          // Fetch transactions for the class
          const transactions = await Transaction.find({
            detail: classItem._id,
          });

          // Fetch user details for each transaction
          const studentDetails = await Promise.all(
            transactions.map(async (transaction) => {
              const userDetails = await Member.findById(transaction.userId);
              return {
                transactionId: transaction._id,
                attendance: transaction.attendance,
                email: userDetails.email,
                phone: userDetails.phone,
              };
            })
          );

          // Return a new object with the students field
          return {
            ...classItem.toObject(), // Convert to plain JS object
            students: studentDetails,
          };
        })
    );

    // console.log(filterList);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to the start of the day

    // Separarted the classes into old and present
    filterList.forEach((classItem) => {
      if (classItem.date < today) {
        oldClasses.push(classItem);
      } else {
        presentClasses.push(classItem);
      }
    });

    // for (const classItem of filterList) {
    //   console.log(`Class ID: ${classItem._id}, Students:`, classItem.students);
    // }

    return res.send({
      // regular: regularClass,
      // popUp: popUpClass,
      // workshop: workshopClass,
      // showCase: showcaseClass,
      // other: otherClass,
      present: presentClasses,
      old: oldClasses,
    });
  } catch (err) {
    console.log(err.message);
  }
});

router.post("/getBookingClassList", Authorization, async (req, res, next) => {
  let { objectId } = req.body;
  const presentClasses = [],
    oldClasses = [];

  console.log(objectId);

  try {
    const filterList = await DanceClass.find({ teacher: objectId });

    console.log(filterList);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to the start of the day

    // Separarted the classes into old and present
    filterList.forEach((classItem) => {
      if (classItem.date < today) {
        oldClasses.push(classItem);
      } else {
        presentClasses.push(classItem);
      }
    });

    // Sort the history classes by date in the descending order (close to today will be the first item)
    oldClasses.sort((a, b) => new Date(b.date) - new Date(a.date));
    // Sort the present classes by date in the ascending order (close to today will be the first item)
    presentClasses.sort((a, b) => new Date(a.date) - new Date(b.date));

    return res.send({
      present: presentClasses,
      old: oldClasses,
    });
  } catch (err) {
    console.log(err.message);
  }
});

router.post("/attendance-update", Authorization, async (req, res, next) => {
  const { transactionId, status } = req.body;
  console.log(transactionId, status);
  try {
    await Transaction.updateOne(
      {
        _id: new ObjectId(transactionId),
      },
      {
        $set: { attendance: status },
      }
    );
    return res.send({ message: `Attendance of ${transactionId} is updated` });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
