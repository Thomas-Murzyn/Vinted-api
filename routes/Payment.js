const express = require("express");
const formidableMiddleware = require("express-formidable");
const router = require("./Offers");
const stripe = require("stripe")("sk_test_votreCléPrivée");
const app = express();
app.use(formidableMiddleware());

router.post("payment", async (req, res) => {
  try {
    console.log("payment");
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
