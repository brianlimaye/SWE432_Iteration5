const mongoose = require('mongoose');

const saveSchema = new mongoose.Schema({
    songTitle: String
});

module.exports = mongoose.model("saves", saveSchema);