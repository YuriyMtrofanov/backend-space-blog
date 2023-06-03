const {Schema, model } = require("mongoose");

const schema = new Schema({
    name: {type: String},
    author: {type: String}, // id автора статьи
    date: Number,
    category: {type: String},
    img: {type: String},
    content: {type: String},
    rate: Number,
    licence: Boolean
}, {
    timestamps: true
});

module.exports = model("Article", schema);