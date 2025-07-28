const { readDb, writeDb } = require('../database');

function getAutoRole(guildId) {
    const db = readDb();
    if (!db.autorole) {
        db.autorole = [];
    }
    return db.autorole.find(ar => ar.guildId === guildId);
}

function setAutoRole(guildId, roleId) {
    const db = readDb();
    if (!db.autorole) {
        db.autorole = [];
    }
    const index = db.autorole.findIndex(ar => ar.guildId === guildId);
    if (index !== -1) {
        db.autorole[index].roleId = roleId;
    } else {
        db.autorole.push({ guildId, roleId, enabled: true });
    }
    writeDb(db);
}

function toggleAutoRole(guildId, enabled) {
    const db = readDb();
    if (!db.autorole) {
        db.autorole = [];
    }
    const index = db.autorole.findIndex(ar => ar.guildId === guildId);
    if (index !== -1) {
        db.autorole[index].enabled = enabled;
        writeDb(db);
    }
}

module.exports = {
    getAutoRole,
    setAutoRole,
    toggleAutoRole,
};
