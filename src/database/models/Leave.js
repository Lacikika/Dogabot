const { readDb, writeDb } = require('../database');

function getLeaveSettings(guildId) {
    const db = readDb();
    if (!db.leave) {
        db.leave = [];
    }
    return db.leave.find(l => l.guildId === guildId);
}

function setLeaveSettings(guildId, settings) {
    const db = readDb();
    if (!db.leave) {
        db.leave = [];
    }
    const index = db.leave.findIndex(l => l.guildId === guildId);
    if (index !== -1) {
        db.leave[index] = { ...db.leave[index], ...settings };
    } else {
        db.leave.push({ guildId, ...settings });
    }
    writeDb(db);
}

module.exports = {
    getLeaveSettings,
    setLeaveSettings,
};
