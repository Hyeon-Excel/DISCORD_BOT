const { saveUserSetting } = require('./storage');
const { deleteUserSetting } = require('./storage');
const { scheduleUserNews, cancelUserSchedule } = require('./scheduler');

async function handleCommand(message, client) {
    const args = message.content.trim().split(/\s+/);
    const command = args.shift();

    if (command === '!뉴스설정') {
        const keyword = args[0];
        const intervalStr = args[1];
        const interval = parseInt(intervalStr);

        if (!keyword || isNaN(interval) || interval <= 0) {
            return message.reply('❗ 사용법: `!뉴스설정 [키워드] [간격(분)]`\n예: `!뉴스설정 경제 30`');
        }

        // 기존 스케줄 제거 후 다시 설정
        await saveUserSetting(message.author.id, keyword, interval);
        cancelUserSchedule(message.author.id);
        scheduleUserNews(message.author, keyword, interval);

        message.reply(`✅ '${keyword}' 뉴스가 ${interval}분마다 전송되도록 설정되었습니다.`);
    }
    else if (command === '!뉴스설정취소') {
        cancelUserSchedule(message.author.id);
        await deleteUserSetting(message.author.id);
        return message.reply('🛑 뉴스 알림이 해제되었습니다.');
    }
}

module.exports = { handleCommand };
