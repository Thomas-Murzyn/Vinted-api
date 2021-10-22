const express = require("express");
const router = express.Router();
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");
const User = require("../models/User");

router.post("/user/login", async (req, res) => {
  try {
    console.log("/user/login ok");
    if (req.fields.email && req.fields.password) {
      const user = await User.findOne({ email: req.fields.email });
      if (user) {
        const password = req.fields.password;
        const salt = user.salt;
        const hash = SHA256(password + salt).toString(encBase64);
        if (hash === user.hash) {
          res.status(200).json({
            message: "Successful authentication",
            id: user.id,
            token: user.token,
            account: {
              username: user.account.username,
              mail: user.email,
            },
          });
        } else {
          res.status(401).json({ message: "Invalid password" });
        }
      } else {
        res
          .status(400)
          .json({ error: "Unknown user please create an account" });
      }
    } else {
      res.status(400).json({ error: "Invalid request" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
