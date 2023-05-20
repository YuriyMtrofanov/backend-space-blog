const {Schema, model } = require("mongoose");

const schema = new Schema({
    name: {type: String, required: true},
    author: {type: String, required: true}, // id автора статьи
    date: Number,
    category: {type: String},
    header: {type: String},
    img: {type: String},
    textContent: {type: String},
    rate: Number,
    bookmark: Boolean
}, {
    timestamps: true
});

module.exports = model("Article", schema);