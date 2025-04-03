const express = require("express");
const router = express.Router();
const passport = require("passport");
const Member = require("../models/member");
const jwt = require("jsonwebtoken");

router.get("/", (req, res) => {
  res.send("<button><a href='/auth/auth'>Login With Google</a></button>");
});

// Auth
router.get(
  "/auth",
  passport.authenticate("google", {
    scope: ["email", "profile"],
    prompt: "select_account",
  })
);

// Auth Callback
// router.get(
//   "/callback",
//   passport.authenticate("google", {
//     successRedirect: "/auth/callback/success",
//     failureRedirect: "/auth/callback/failure",
//   })
// );

// New Auth Callback
router.get(
  "/callback",
  passport.authenticate("google", {
    session: false,
  }),
  async (req, res) => {
    if (!req.user) res.redirect("/callback/failure");
    const user = req.user._json;
    try {
      //   console.log("I am here");
      const existingUser = await Member.findOne({ email: user.email });

      if (!existingUser) {
        return res.redirect(
          `/auth/callback/register?email=${user.email}&name=${user.name}&=id=${user.sub}`
        );
      }

      const payload = {
        objectId: existingUser._id,
        role: existingUser.role,
      };

      const private_key =
        process.env.JWT_SECRET || "KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp";

      const token = jwt.sign({ payload }, private_key, {
        expiresIn: "3d",
      });

      res.redirect(
        `http://localhost:3000/auth/google-callback?token=${token}&role=${existingUser.role}&status=login`
      );
    } catch (err) {
      console.log(err);
    }
  }
);

// Register new member with Google Account
router.get("/callback/register", async (req, res) => {
  const { email, name, sub } = req.query;
  try {
    const newMember = new Member({
      email,
      nickname: name,
      googleId: sub,
      status: true,
    });
    await newMember.save();
    res.redirect(
      `http://localhost:3000/auth/google-callback?token=null&role=null&status=register`
    );
  } catch (err) {
    console.log("Database Error", err);
    res.status(500).send("Database Error");
  }
});

// Success
router.get("/callback/success", async (req, res) => {
  if (!req.user) res.redirect("/callback/failure");
  //   try {
  //     const response = await fetch("http://localhost:3030/google/login", {
  //       method: "POST",
  //       headers: { "Content-type": "application/json" },
  //       body: JSON.stringify({ user: req.user }),
  //     });

  //     if (!response) throw new Error("Server Error");

  //     return res.send({ message: "OK" });
  //   } catch (err) {
  //     console.log("Backend Server Error", err.message);
  //   }
  //   console.log("Cookies before logout:", req.cookies);
  //   console.log(req.user);
  //   res.send(
  //     `<h2>Welcome ${req.user.emails[0].value}</h2>
  //     <button>
  //       <a href="/auth/logout">Logout With Google</a>
  //     </button>`
  //   );
  res.send("OK");
});

// failure
router.get("/callback/failure", (req, res) => {
  res.send("Error");
});

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    // Destroy the session explicitly
    req.session.destroy((err) => {
      if (err) {
        console.error("Session destroy error:", err);
        return next(err);
      }
      // Clear the session cookie
      res.clearCookie("connect.sid", { path: "/" });
      console.log("Cookies after logout:", req.cookies);
      res.redirect("/auth"); // Redirect to login page
    });
  });
  console.log("Cookies after logout2:", req.cookies);
});

router.get("/check-cookies", (req, res) => {
  console.log("Current cookies:", req.cookies);
  res.send(req.cookies);
});

module.exports = router;
