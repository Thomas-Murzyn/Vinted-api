const express = require("express");
const router = express.Router();
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");
const User = require("../models/User");
const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: "dkwgtzzxc",
  api_key: "759894671485462",
  api_secret: "yLi_0zya8cMS-S6ZbtCr8XgwaO4",
});

router.post("/user/signup", async (req, res) => {
  try {
    console.log("/user/signup ok");

    const user = await User.findOne({ email: req.fields.email });

    if (user) {
      res.status(400).json({ message: "User account already exists" });
    } else {
      if (req.fields.username && req.fields.email && req.fields.password) {
        const password = req.fields.password;
        const salt = uid2(16);
        const hash = SHA256(password + salt).toString(encBase64);
        const token = uid2(16);

        const newUser = new User({
          email: req.fields.email,
          account: {
            username: req.fields.username,
            phone: req.fields.phone,
          },
          token: token,
          hash: hash,
          salt: salt,
        });

        // const resultUpload = await cloudinary.uploader.upload(
        //   req.files.picture.path
        // );

        // newUser.profil_picture = resultUpload;

        const result = await newUser.save();
        res.status(200).json({
          message: "Account created",
          id: result.id,
          token: result.token,
          account: {
            username: result.account.username,
            mail: result.email,
          },
        });
      } else {
        res.status(400).json({ error: "Invalid request" });
      }
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
module.exports = router;
