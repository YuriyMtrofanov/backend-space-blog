const { Schema, model } = require("mongoose");

const schema = new Schema({
    content: {type: String, required: true},
	articleId: {type: Schema.Types.ObjectId, ref: "User", required: true}, // id статьи, под которой находится комментарий
	userId: {type: Schema.Types.ObjectId, ref: "User", required: true} // id человека, который оставил комментарий
}, {
    timestamps: {createdAt: "created_at"}
});

module.exports = model("Comment", schema);