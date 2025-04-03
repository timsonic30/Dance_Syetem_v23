const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const cors = require("cors");
const logger = require("morgan");
require("dotenv").config();

const passport = require("passport");
const session = require("express-session");
const cookieParser = require("cookie-parser");
require("./config/passport");

app.use(bodyParser.json());
app.use(cors());
app.use(logger("dev"));

app.use(cookieParser());

app.use(
  session({
    secret: "your_secret_key", // Use a strong secret key
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 60000 }, // Set to true if using HTTPS
  })
);

app.use(passport.initialize());
app.use(passport.session());

const port = process.env.PORT || 3030;

const indexRouter = require("./routes/index"); // The location of the file
const memberRouter = require("./routes/member"); // The location of the file
const danceClass = require("./routes/danceclass"); //課程的資料
const teacherRouter = require("./routes/teacher"); // 老師的資料
const staffRouter = require("./routes/staff"); // 職員的資料
const payProductRouter = require("./routes/payProductRoutes"); //商品的資料
const shoppingCart = require("./routes/shoppingCartRoutes"); //購物車的資料
const emailRouter = require("./routes/email"); // Send email
const competitionApplyRouter = require("./routes/competitionApply");
const authRouter = require("./routes/auth"); // for third-party module
const transactionRouter = require("./routes/transactionRoutes"); //有關交易的collection

app.use("/", indexRouter);
app.use("/member", memberRouter);
app.use("/danceClass", danceClass);
app.use("/teacher", teacherRouter);
app.use("/staff", staffRouter);
app.use("/payProduct", payProductRouter);
app.use("/shoppingCart", shoppingCart);
app.use("/competitionApply", competitionApplyRouter);
app.use("/email", emailRouter);
// Serve static files for uploaded transaction slips
app.use("/uploads", express.static("uploads"));
app.use("/auth", authRouter);
app.use("/transaction", transactionRouter);

app.listen(port, () => {
  console.log(`Server listening to ${port}`);
});
