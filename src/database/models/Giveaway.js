const { readDb, writeDb } = require('../database');

function getGiveaways() {
    const db = readDb();
    if (!db.giveaways) {
        db.giveaways = [];
    }
    return db.giveaways;
}

function addGiveaway(giveaway) {
    const db = readDb();
    if (!db.giveaways) {
        db.giveaways = [];
    }
    db.giveaways.push(giveaway);
    writeDb(db);
}

function updateGiveaway(messageId, data) {
    const db = readDb();
    if (!db.giveaways) {
        db.giveaways = [];
    }
    const index = db.giveaways.findIndex(g => g.messageId === messageId);
    if (index !== -1) {
        db.giveaways[index] = { ...db.giveaways[index], ...data };
        writeDb(db);
    }
}

module.exports = {
    getGiveaways,
    addGiveaway,
    updateGiveaway,
};
