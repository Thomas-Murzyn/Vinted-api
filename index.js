require("dotenv").config();
const express = require("express");
const formidable = require("express-formidable");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const cors = require("cors");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
app.use(formidable());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI);

const signUp = require("./routes/SignUp");
app.use(signUp);

const logIn = require("./routes/LogIn");
app.use(logIn);

const publish = require("./routes/Publish");
app.use(publish);

const offer = require("./routes/Offers");
app.use(offer);

const payment = require("./routes/Payment");
app.use(payment);

app.listen(process.env.PORT, () => {
  console.log("Server has started ...");
});
