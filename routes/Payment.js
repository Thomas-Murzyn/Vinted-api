require("dotenv").config({ path: require("find-config")(".env") });
const express = require("express");
const formidableMiddleware = require("express-formidable");
const router = require("./Offers");
const stripe = require("stripe")(process.env.STRIPE_KEY);
const app = express();
app.use(formidableMiddleware());

router.post("/payment", async (req, res) => {
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

module.exports = router;
