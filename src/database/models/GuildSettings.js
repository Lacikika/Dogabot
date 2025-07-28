const mongoose = require('mongoose');

const GuildSettingsSchema = new mongoose.Schema({
    guildId: { type: String, required: true },
    leveling: {
        enabled: { type: Boolean, default: true },
    },
});

module.exports = mongoose.model('GuildSettings', GuildSettingsSchema);
