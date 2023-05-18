const express = require("express");
const router = express.Router({ mergeParams: true });
const Article = require("../models/Article");

router.get("/", async (req, res) => {
    try {
        const article = await Article.find();
        res.status(200).send(article);
    } catch (error) {
        res.status(500).json({
            message: "Oops! There is some error! Please try later..."
        });
    }
});

module.exports = router;