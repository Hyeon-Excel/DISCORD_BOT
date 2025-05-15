const { saveUserSetting } = require('./storage');
const { scheduleUserNews } = require('./scheduler');

async function handleCommand(message, client) {
    const [cmd, keyword, intervalStr] = message.content.split(' ');
    if (cmd === '!뉴스설정') {
        const interval = parseInt(intervalStr);
        if (!keyword || isNaN(interval)) {
            return message.reply('사용법: !뉴스설정 [키워드] [분 단위 간격]');
        }

        await saveUserSetting(message.author.id, keyword, interval);
        scheduleUserNews(message.author, keyword, interval);
        message.reply(`'${keyword}' 뉴스 알림이 ${interval}분마다 설정되었습니다.`);
    }
}

module.exports = { handleCommand };
