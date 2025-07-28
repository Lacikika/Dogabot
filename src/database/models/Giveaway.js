const mongoose = require('mongoose');

const GiveawaySchema = new mongoose.Schema({
    messageId: { type: String, required: true },
    channelId: { type: String, required: true },
    guildId: { type: String, required: true },
    prize: { type: String, required: true },
    winners: { type: Number, required: true },
    endAt: { type: Date, required: true },
    ended: { type: Boolean, default: false },
});

module.exports = mongoose.model('Giveaway', GiveawaySchema);
