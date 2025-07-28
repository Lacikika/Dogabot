const { readDb, writeDb } = require('../database');

function getWelcomeSettings(guildId) {
    const db = readDb();
    if (!db.welcome) {
        db.welcome = [];
    }
    return db.welcome.find(w => w.guildId === guildId);
}

function setWelcomeSettings(guildId, settings) {
    const db = readDb();
    if (!db.welcome) {
        db.welcome = [];
    }
    const index = db.welcome.findIndex(w => w.guildId === guildId);
    if (index !== -1) {
        db.welcome[index] = { ...db.welcome[index], ...settings };
    } else {
        db.welcome.push({ guildId, ...settings });
    }
    writeDb(db);
}

module.exports = {
    getWelcomeSettings,
    setWelcomeSettings,
};
