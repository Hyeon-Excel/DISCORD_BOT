const { fetchNews } = require('./newsFetcher');
const { getLastLink, updateLastLink } = require('./storage');
const { stripHtml } = require('./utils');

const userTimers = new Map();

function buildTimerKey(userId, keyword) {
    return `${userId}_${keyword}`;
}

function scheduleUserNews(user, keyword, interval) {
    const timerKey = buildTimerKey(user.id, keyword);
    if (userTimers.has(timerKey)) return; // 이미 등록된 경우 무시

    const timer = setInterval(async () => {
        const news = await fetchNews(keyword);
        if (!news.length) return;

        const latest = news[0];
        const lastLink = getLastLink(user.id, keyword);
        if (latest.link !== lastLink) {
            await user.send(`${stripHtml(latest.title)}\n${latest.link}`);
            await updateLastLink(user.id, keyword, latest.link);
        }
    }, interval * 60 * 1000);

    userTimers.set(timerKey, timer);
}

function cancelUserSchedule(userId, keyword = null) {
    if (keyword) {
        const timerKey = buildTimerKey(userId, keyword);
        if (userTimers.has(timerKey)) {
            clearInterval(userTimers.get(timerKey));
            userTimers.delete(timerKey);
        }
    } else {
        // keyword 없으면 해당 유저의 모든 타이머 제거
        for (const [key, timer] of userTimers) {
            if (key.startsWith(`${userId}_`)) {
                clearInterval(timer);
                userTimers.delete(key);
            }
        }
    }
}

module.exports = { scheduleUserNews, cancelUserSchedule };
