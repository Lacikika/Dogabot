const mongoose = require('mongoose');

const LeaveSchema = new mongoose.Schema({
    guildId: { type: String, required: true },
    channelId: { type: String, required: true },
    message: { type: String, default: '{user} has left the server.' },
    enabled: { type: Boolean, default: true },
});

module.exports = mongoose.model('Leave', LeaveSchema);
