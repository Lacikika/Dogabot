const { readDb, writeDb } = require('../database');

function getWarns(userId, guildId) {
    const db = readDb();
    if (!db.warns) {
        db.warns = [];
    }
    return db.warns.filter(w => w.userId === userId && w.guildId === guildId);
}

function addWarn(warn) {
    const db = readDb();
    if (!db.warns) {
        db.warns = [];
    }
    db.warns.push(warn);
    writeDb(db);
}

module.exports = {
    getWarns,
    addWarn,
};
