const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/User");
const Offer = require("../models/Offer");
const isAuthenticated = require("../middleware/isAuthenticated");
const cloudinary = require("cloudinary").v2;
const { findByIdAndUpdate } = require("../models/User");

// Publier une annonce

router.post("/offer/publish", isAuthenticated, async (req, res) => {
  try {
    console.log("/offer/publish");

    const newOffer = new Offer({
      product_name: req.fields.title,
      product_description: req.fields.description,
      product_price: req.fields.price,
      product_details: [
        { MARQUE: req.fields.brand },
        { TAILLE: req.fields.size },
        { ETAT: req.fields.condition },
        { COULEUR: req.fields.color },
        { EMPLACEMENT: req.fields.city },
      ],
      owner: req.user,
    });
    let offerId = await newOffer.save();
    offerId = offerId.id;
    console.log(offerId);
    let pictureToUpload = req.files.picture.path;
    const resultUpload = await cloudinary.uploader.upload(pictureToUpload, {
      public_id: `vinted/offers/${offerId}`,
    });
    newOffer.product_image = resultUpload;
    const result = await newOffer.save();
    res.json({ message: "success", result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Modifier une annconce publiée

router.put("/offer/update", isAuthenticated, async (req, res) => {
  try {
    console.log("/offer/update");
    if (!req.fields.id) {
      res.status(400).json({ message: "Missing parametres" });
    } else {
      await Offer.findByIdAndUpdate(req.fields.id, {
        product_name: req.fields.product_name,
        product_description: req.fields.product_description,
        product_price: req.fields.product_price,
        product_details: [
          { MARQUE: req.fields.brand },
          { TAILLE: req.fields.size },
          { ETAT: req.fields.condition },
          { COULEUR: req.fields.color },
          { EMPLACEMENT: req.fields.city },
        ],
        owner: req.user,
      });

      const updatePicture = await cloudinary.uploader.upload(
        req.files.picture.path,
        {
          public_id: `vinted/offers/${req.fields.id}`,
        }
      );
      const offer = await Offer.findByIdAndUpdate(req.fields.id, {
        product_image: updatePicture,
      });
      res.json({ message: "Successfull update", offer });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// création d'une route delete

router.delete("/offer/delete", isAuthenticated, async (req, res) => {
  try {
    console.log("/offer/delete");
    if (!req.fields.id) {
      res.status(400).json({ message: "Missing parametres" });
    } else {
      const deleted = await Offer.findByIdAndDelete(req.fields.id);
      res.json({ message: "Successfully deleted", deleted });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
