require("dotenv").config();
const express = require("express");
const formidable = require("express-formidable");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const cors = require("cors");
const stripe = require("stripe")(process.env.STRIPE_KEY);

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

app.post("/payment", async (req, res) => {
  try {
    console.log("/payment");
    const response = await stripe.charges.create({
      amount: req.fields.price * 100,
      currency: "eur",
      description: req.fields.title,
      source: req.fields.stripeToken,
    });

    console.log(response.status);

    res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
});

app.listen(process.env.PORT, () => {
  console.log("Server has started ...");
});
