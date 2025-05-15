const { fetchNews } = require('./newsFetcher');
const { getLastLink, updateLastLink } = require('./storage');
const { stripHtml } = require('./utils');

const userTimers = new Map();

function buildTimerKey(userId, keyword) {
    return `${userId}_${keyword}`;
}

function scheduleUserNews(user, keyword, interval, channelId = null) {
    const timerKey = buildTimerKey(user.id, keyword);
    if (userTimers.has(timerKey)) return;

    const timer = setInterval(async () => {
        const news = await fetchNews(keyword);
        if (!news.length) return;

        const latest = news[0];
        const lastLink = getLastLink(user.id, keyword);
        if (latest.link !== lastLink) {
            try {
                const message = `${stripHtml(latest.title)}\n${latest.link}`;
                if (channelId) {
                    const channel = await user.client.channels.fetch(channelId);
                    await channel.send(message);
                } else {
                    await user.send(message);
                }
                await updateLastLink(user.id, keyword, latest.link);
            } catch (err) {
                console.error(`❗ 뉴스 전송 실패 (${user.id}, ${keyword}):`, err.message);
            }
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
        for (const [key, timer] of userTimers) {
            if (key.startsWith(`${userId}_`)) {
                clearInterval(timer);
                userTimers.delete(key);
            }
        }
    }
}

module.exports = { scheduleUserNews, cancelUserSchedule };
