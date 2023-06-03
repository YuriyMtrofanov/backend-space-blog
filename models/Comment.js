const { Schema, model } = require("mongoose");

const schema = new Schema({
    content: {type: String, required: true},
	pageId: {type: String, required: true}, // id статьи, под которой находится комментарий
	userId: {type: String, required: true}, // id человека, который оставил комментарий
    created_at: {type: Number, required: true}
}, {
    timestamps: {createdAt: "created_at"}
});

module.exports = model("Comment", schema);