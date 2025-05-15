const { fetchNews } = require('./newsFetcher');
const { getLastLink, updateLastLink } = require('./storage');
const { stripHtml } = require('./utils');

const userTimers = new Map();

function scheduleUserNews(user, keyword, interval) {
    if (userTimers.has(user.id)) return; // 이미 등록된 경우 무시

    const timer = setInterval(async () => {
        const news = await fetchNews(keyword);
        if (!news.length) return;

        const latest = news[0];
        const lastLink = getLastLink(user.id);
        if (latest.link !== lastLink) {
            await user.send(`${stripHtml(latest.title)}\n${latest.link}`);
            await updateLastLink(user.id, latest.link);
        }
    }, interval * 60 * 1000);

    userTimers.set(user.id, timer);
}

function cancelUserSchedule(userId) {
    const timer = userTimers.get(userId);
    if (timer) {
        clearInterval(timer);
        userTimers.delete(userId);
    }
}

module.exports = { scheduleUserNews, cancelUserSchedule };
