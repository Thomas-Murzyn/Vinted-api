const express = require("express");
const monsoose = require("mongoose");
const Offer = require("../models/Offer");
const router = express.Router();

router.get("/offers", async (req, res) => {
  try {
    console.log("/offers");

    const filter = {};
    const maxPages = 6;
    let page = 1;

    if (req.query.title) {
      const newRegex = new RegExp(req.query.title, "i");
      filter.product_name = newRegex;
    }

    if (req.query.priceMin) {
      filter.product_price = { $gte: Number(req.query.priceMin) };
    }

    if (req.query.priceMax) {
      if (filter.product_price) {
        filter.product_price.$lte = Number(req.query.priceMax);
      } else {
        filter.product_price = { $gte: Number(req.query.priceMax) };
      }
    }

    const sort = { product_price: 1 };

    if (req.query.sort === "desc") {
      sort.product_price = -1;
    }

    if (req.query.page) {
      page = req.query.page;
    }

    const allOffers = await Offer.find(filter)
      .limit(maxPages)
      .skip(maxPages * (page - 1))
      .sort(sort)
      .select();

    const count = await Offer.countDocuments(filter);
    res.json({ count: count, allOffers });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/offer/:id", async (req, res) => {
  try {
    console.log("/offer/:id");
    const offer = await Offer.findById(req.params.id);
    if (!offer) {
      res.status(400).json({ message: "No such offer" });
    } else {
      res.json({ offer });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
