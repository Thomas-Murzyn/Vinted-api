const express = require("express");
const formidableMiddleware = require("express-formidable");
const router = require("./Offers");
const stripe = require("stripe")(
  "sk_test_51JwQnrJFbql4c6yPB6c9r6CqA4uyhIhVmcx6iJZcHHx8TtavQy4yJKEkaixHWuENV0nCoO0TwR1XVI7Gszb8f1aN00R4g63IPV"
);
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
