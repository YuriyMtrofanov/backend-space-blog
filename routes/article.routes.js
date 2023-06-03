const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const router = express.Router({ mergeParams: true });
const Article = require("../models/Article");

// ./api/article - получение статей
router.get("/", authMiddleware, async (req, res) => {
    try {
        const articlesList = await Article.find();
        res.status(200).send(articlesList);
    } catch (error) {
        res.status(500).json({
            message: "Oops! There is some error! Please try later..."
        });
    }
});

// ./api/article - создание статьи
router.post("/", authMiddleware, async (req, res) => {
    try {
        const newArticle = await Article.create({
            ...req.body,
            articleId: req.body._id
        });
        res.status(201).send(newArticle);
    } catch (error) {
        res.status(500).json({
            messge: "На сервере произошла ошибка. Попробуйте позже..."
        });
    }
});

// ./api/user/:articleId - изменение статьи
router.patch("/:articleId", authMiddleware, async (req, res) => {
    try {
        const { articleId } = req.params;
        // console.log("req.params", req.body, articleId);
        if (articleId === req.body._id) {
            const updatedArticle = await Article.findByIdAndUpdate(articleId, req.body, {new: true});
            res.send(updatedArticle);
        } else {
            res.status(401).json({message: "Unauthorized"});
        }
    } catch (error) {
        res.status(500).json({
            messge: "На сервере произошла ошибка. Попробуйте позже..."
        });
    }
});

// ./api/user/:articleId - удаление статьи статьи
router.delete("/:articleId", authMiddleware, async (req, res) => {
    try {
        const { articleId } = req.params;
        const removedArticle = await Article.findById(articleId);
        if (removedArticle.author.toString() === req.user._id){
            removedArticle.deleteOne();
            return res.send(null);
        } else {
            return res.status(401).json({message: 'Unauthorized'});
        }
    } catch (error) {
        console.log("messge:", error);
        res.status(500).json({
            messge: "На сервере произошла ошибка. Попробуйте позже..."
        });
    }
});

module.exports = router;