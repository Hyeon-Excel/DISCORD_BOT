const { fetchTopicNews } = require('./fetchTopicNews');
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

    const timer = setInterval(async () => {
        const news = await fetchTopicNews(keyword); // keyword = 'korea' 같은 키
        if (!news.length) return;

        const lastLink = getLastLink(user.id, keyword);
        const newItems = news.filter(item => item.link !== lastLink);

        if (!newItems.length) return;

        const channel = channelId
            ? await user.client.channels.fetch(channelId)
            : null;

        const createEmbed = (item) => new EmbedBuilder()
            .setTitle(stripHtml(item.title))
            .setURL(item.link)
            .setTimestamp(new Date(item.pubDate || Date.now()))
            .setFooter({ text: `📑 ${keyword}` });

        if (interval === 0) {
            // 실시간 모드: 최신 뉴스 한 건만 전송
            const embed = createEmbed(newItems[0]);
            await (channel ? channel.send({ embeds: [embed] }) : user.send({ embeds: [embed] }));
            await updateLastLink(user.id, keyword, newItems[0].link);
        } else {
            // 누적 모드: 최대 10건까지 한 번에 전송
            const embeds = newItems.slice(0, 10).map(createEmbed);
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