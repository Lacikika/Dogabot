const { readDb, writeDb } = require('../database');

function getLevel(userId, guildId) {
    const db = readDb();
    if (!db.levels) {
        db.levels = [];
    }
    return db.levels.find(l => l.userId === userId && l.guildId === guildId);
}

function updateLevel(userId, guildId, data) {
    const db = readDb();
    if (!db.levels) {
        db.levels = [];
    }
    const index = db.levels.findIndex(l => l.userId === userId && l.guildId === guildId);
    if (index !== -1) {
        db.levels[index] = { ...db.levels[index], ...data };
    } else {
        db.levels.push({ userId, guildId, ...data });
    }
    writeDb(db);
}

module.exports = {
    getLevel,
    updateLevel,
};
