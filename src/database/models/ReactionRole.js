const { readDb, writeDb } = require('../database');

function getReactionRoles(guildId) {
    const db = readDb();
    if (!db.reactionRoles) {
        db.reactionRoles = [];
    }
    return db.reactionRoles.filter(rr => rr.guildId === guildId);
}

function addReactionRole(guildId, messageId, emoji, roleId) {
    const db = readDb();
    if (!db.reactionRoles) {
        db.reactionRoles = [];
    }
    db.reactionRoles.push({ guildId, messageId, emoji, roleId });
    writeDb(db);
}

function removeReactionRole(guildId, messageId, emoji) {
    const db = readDb();
    if (!db.reactionRoles) {
        db.reactionRoles = [];
    }
    db.reactionRoles = db.reactionRoles.filter(rr => rr.guildId !== guildId || rr.messageId !== messageId || rr.emoji !== emoji);
    writeDb(db);
}

module.exports = {
    getReactionRoles,
    addReactionRole,
    removeReactionRole,
};
