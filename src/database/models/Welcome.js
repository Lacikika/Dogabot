const mongoose = require('mongoose');

const WelcomeSchema = new mongoose.Schema({
    guildId: { type: String, required: true },
    channelId: { type: String, required: true },
    message: { type: String, default: 'Welcome {user} to {server}!' },
    enabled: { type: Boolean, default: true },
});

module.exports = mongoose.model('Welcome', WelcomeSchema);
