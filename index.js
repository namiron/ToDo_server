const express = require("express");
const config = require("config");
const mongoose = require("mongoose");
require("./passport");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");
const googleRouter = require("./routes/google.routes");
const authRouter = require("./routes/auth.routes");
const PORT = config.get("PORT") || 5000;
const dbUrl = config.get("dbUrl");
const baseUrl = config.get("BASE_URL");
const secretKey = config.get("secretKey");
//------------------------------------------------CONST

//---------------------------------APP
const app = express();
app.use(express.json());
app.use(
  session({
    secret: secretKey,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(
  cors({
    origin: baseUrl,
    credentials: true,
  })
);
app.use(express.json());
app.use("/auth", googleRouter);
app.use("/auth", authRouter);

app.use("/", (req, res) => {
  res.send("hello world");
});
//---------------------------------/APP

const start = async () => {
  try {
    const Mongodb = await mongoose.connect(dbUrl);
    if (Mongodb) console.log("Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
    process.exit(1);
  }
};
start();

// alxlxa@gmail.com
// 12345
