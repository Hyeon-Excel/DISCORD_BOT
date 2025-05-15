const { Low, JSONFile } = require('lowdb');
const db = new Low(new JSONFile('db.json'));

async function saveUserSetting(userId, keyword, interval) {
    await db.read();
    db.data ||= { users: {} };
    db.data.users[userId] = { keyword, interval, lastLink: null };
    await db.write();
}

async function loadUserSettings() {
    await db.read();
    db.data ||= { users: {} };
    return db.data.users;
}

async function updateLastLink(userId, link) {
    await db.read();
    if (db.data.users[userId]) {
        db.data.users[userId].lastLink = link;
        await db.write();
    }
}

function getLastLink(userId) {
    return db.data?.users?.[userId]?.lastLink || null;
}

module.exports = { saveUserSetting, loadUserSettings, updateLastLink, getLastLink };
