const { readDb, writeDb } = require('../database');

function getEconomy(userId, guildId) {
    const db = readDb();
    if (!db.economy) {
        db.economy = [];
    }
    return db.economy.find(e => e.userId === userId && e.guildId === guildId);
}

function updateEconomy(userId, guildId, data) {
    const db = readDb();
    if (!db.economy) {
        db.economy = [];
    }
    const index = db.economy.findIndex(e => e.userId === userId && e.guildId === guildId);
    if (index !== -1) {
        db.economy[index] = { ...db.economy[index], ...data };
    } else {
        db.economy.push({ userId, guildId, ...data });
    }
    writeDb(db);
}

module.exports = {
    getEconomy,
    updateEconomy,
};
