const { readDb, writeDb } = require('../database');

function getReminders() {
    const db = readDb();
    if (!db.reminders) {
        db.reminders = [];
    }
    return db.reminders;
}

function addReminder(reminder) {
    const db = readDb();
    if (!db.reminders) {
        db.reminders = [];
    }
    db.reminders.push(reminder);
    writeDb(db);
}

function removeReminder(userId, message) {
    const db = readDb();
    if (!db.reminders) {
        db.reminders = [];
    }
    db.reminders = db.reminders.filter(r => r.userId !== userId || r.message !== message);
    writeDb(db);
}

module.exports = {
    getReminders,
    addReminder,
    removeReminder,
};
