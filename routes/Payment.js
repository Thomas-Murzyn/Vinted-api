const express = require("express");
const formidableMiddleware = require("express-formidable");
const cors = require("cors");
const stripe = require("stripe")("sk_test_votreCléPrivée");
const app = express();
app.use(formidableMiddleware());
app.use(cors());
const router = express.Router();

router.post("/payment", async (req, res) => {
  try {
    console.log("/payment");
  } catch (error) {
    console.log(error.message);
  }
});
