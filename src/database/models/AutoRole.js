const mongoose = require('mongoose');

const AutoRoleSchema = new mongoose.Schema({
    guildId: { type: String, required: true },
    roleId: { type: String, required: true },
    enabled: { type: Boolean, default: true },
});

module.exports = mongoose.model('AutoRole', AutoRoleSchema);
