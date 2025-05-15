const { fetchNews } = require('./newsFetcher');
const { getLastLink, updateLastLink } = require('./storage');
const { stripHtml } = require('./utils');

function scheduleUserNews(user, keyword, interval) {
    setInterval(async () => {
        const news = await fetchNews(keyword);
        if (!news.length) return;

        const latest = news[0];
        const lastLink = getLastLink(user.id);
        if (latest.link !== lastLink) {
            await user.send(`${stripHtml(latest.title)}\n${latest.link}`);
            await updateLastLink(user.id, latest.link);
        }
    }, interval * 60 * 1000);
}

module.exports = { scheduleUserNews };
