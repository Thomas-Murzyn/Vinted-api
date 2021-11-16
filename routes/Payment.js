const express = require("express");
const formidableMiddleware = require("express-formidable");
const cors = require("cors");
const stripe = require("stripe")(
  "sk_test_51JwQnrJFbql4c6yPB6c9r6CqA4uyhIhVmcx6iJZcHHx8TtavQy4yJKEkaixHWuENV0nCoO0TwR1XVI7Gszb8f1aN00R4g63IPV"
);
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
