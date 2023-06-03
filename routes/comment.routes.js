const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const Comment = require("../models/Comment");
const router = express.Router({ mergeParams: true });

router.get("/", authMiddleware, async (req, res) => {
        try {
            const { orderBy, equalTo } = req.body;
            const commentsList = await Comment.find({ [orderBy]: equalTo });
            res.status(200).send(commentsList);
        } catch (error) {
            res.status(500).json({
                messge: "На сервере произошла ошибка. Попробуйте позже..."
            });
        }
    });

router.post("/", authMiddleware, async (req, res) => {
        try {
            console.log("req", req);
            const newComment = await Comment.create({
                ...req.body,
                // userId: req.body._id
            });
            // console.log("newComment", newComment);
            res.status(201).send(newComment);
        } catch (error) {
            res.status(500).json({
                messge: "На сервере произошла ошибка. Попробуйте позже..."
            });
        }
    });

router.delete("/:commentId", authMiddleware, async (req, res) => {
    try {
        const { commentId } = req.params
        const removedComment = await Comment.findById(commentId)
        if (removedComment.userId.toString() === req.user._id.toString()) {
            await removedComment.remove()
            return res.send(null)
        } else {
            res.status(401).json({message: "Unauthorized"})
        }
    } catch (e) {
            res.status(500).json({
            message: "На сервере произошла ошибка. Попробуйте позже"
        })
    }
});

module.exports = router;