const { Low, JSONFile } = require('lowdb');
const db = new Low(new JSONFile('db.json'));

async function saveUserSetting(userId, keyword, interval) {
    await db.read();
    db.data ||= { users: {} };
    db.data.users[userId] = { keyword, interval, lastLink: null };
    await db.write();
}

async function loadUserSettings() {
    try {
        await db.read();
        db.data ||= { users: {} };
        return db.data.users;
    } catch (err) {
        db.data = { users: {} };
        await db.write();
        return {};
    }
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

async function deleteUserSetting(userId) {
    await db.read();
    if (db.data.users?.[userId]) {
        delete db.data.users[userId];
        await db.write();
    }
}

module.exports = { saveUserSetting, loadUserSettings, updateLastLink, getLastLink, deleteUserSetting };
