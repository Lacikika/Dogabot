const { readDb, writeDb } = require('../database');

function getGuildSettings(guildId) {
    const db = readDb();
    if (!db.guildSettings) {
        db.guildSettings = [];
    }
    return db.guildSettings.find(gs => gs.guildId === guildId);
}

function updateGuildSettings(guildId, data) {
    const db = readDb();
    if (!db.guildSettings) {
        db.guildSettings = [];
    }
    const index = db.guildSettings.findIndex(gs => gs.guildId === guildId);
    if (index !== -1) {
        db.guildSettings[index] = { ...db.guildSettings[index], ...data };
    } else {
        db.guildSettings.push({ guildId, ...data });
    }
    writeDb(db);
}

module.exports = {
    getGuildSettings,
    updateGuildSettings,
};
