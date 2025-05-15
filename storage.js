const { Low, JSONFile } = require('lowdb');
const db = new Low(new JSONFile('db.json'));

async function saveUserSetting(userId, keyword, interval) {
    await db.read();
    db.data ||= { users: {} };
    db.data.users[userId] ||= [];

    const existing = db.data.users[userId].find(cfg => cfg.keyword === keyword);
    if (existing) {
        existing.interval = interval;
    } else {
        db.data.users[userId].push({ keyword, interval, lastLink: null });
    }

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

async function updateLastLink(userId, keyword, link) {
    await db.read();
    const userConfigs = db.data.users?.[userId];
    const config = userConfigs?.find(cfg => cfg.keyword === keyword);
    if (config) {
        config.lastLink = link;
        await db.write();
    }
}

function getLastLink(userId, keyword) {
    const userConfigs = db.data?.users?.[userId];
    return userConfigs?.find(cfg => cfg.keyword === keyword)?.lastLink || null;
}


async function deleteUserSetting(userId, keyword = null) {
    await db.read();
    if (!db.data.users?.[userId]) return;

    if (keyword) {
        db.data.users[userId] = db.data.users[userId].filter(cfg => cfg.keyword !== keyword);
        if (db.data.users[userId].length === 0) {
            delete db.data.users[userId];
        }
    } else {
        delete db.data.users[userId];
    }

    await db.write();
}

module.exports = { saveUserSetting, loadUserSettings, updateLastLink, getLastLink, deleteUserSetting };