const mongoose = require('mongoose');

const EconomySchema = new mongoose.Schema({
    userId: { type: String, required: true },
    guildId: { type: String, required: true },
    balance: { type: Number, default: 0 },
    lastDaily: { type: Date, default: null },
});

module.exports = mongoose.model('Economy', EconomySchema);
