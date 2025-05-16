const { fetchNews } = require('./newsFetcher');
const { getLastLink, updateLastLink } = require('./storage');
const { stripHtml, extractPressName } = require('./utils');
const { EmbedBuilder } = require('discord.js');

const userTimers = new Map();

function buildTimerKey(userId, keyword) {
    return `${userId}_${keyword}`;
}

function scheduleUserNews(user, keyword, interval, channelId = null) {
    const timerKey = buildTimerKey(user.id, keyword);
    if (userTimers.has(timerKey)) return;

    let lastCheckedTime = new Date();

    const timer = setInterval(async () => {
        const news = await fetchNews(keyword);
        if (!news.length) return;

        const lastLink = getLastLink(user.id, keyword);
        const newItems = news.filter(item => item.link !== lastLink);

        if (!newItems.length) return;

        const channel = channelId
            ? await user.client.channels.fetch(channelId)
            : null;

        const latest = newItems[0];
        const embed = new EmbedBuilder()
            .setTitle(`📑${keyword} | ${stripHtml(latest.title)}`)
            .setURL(latest.link)
            .setTimestamp(new Date(latest.pubDate || Date.now()))
            .setFooter({ text: `📰 ${extractPressName(latest.originallink)}` });

        if (interval === 0) {
            await (channel ? channel.send({ embeds: [embed] }) : user.send({ embeds: [embed] }));
            await updateLastLink(user.id, keyword, latest.link);
        } else {
            const embeds = newItems.slice(0, 10).map(item => new EmbedBuilder()
                .setTitle(`📑${keyword} | ${stripHtml(item.title)}`)
                .setURL(item.link)
                .setTimestamp(new Date(item.pubDate || Date.now()))
                .setFooter({ text: `📰 ${extractPressName(item.originallink)}` }));

            await (channel ? channel.send({ embeds }) : user.send({ embeds }));
            await updateLastLink(user.id, keyword, newItems[0].link);
        }
    }, (interval === 0 ? 30 : interval * 60) * 1000);

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