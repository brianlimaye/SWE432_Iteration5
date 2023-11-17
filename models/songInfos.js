const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
    title: String,
    artist: String,
    genre: String,
    duration: Number,
    year: Number,
    moreinfo: String
});

module.exports = mongoose.model("songInfos", songSchema);