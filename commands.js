const {
    saveUserSetting,
    deleteUserSetting,
    loadUserSettings
} = require('./storage');
const { scheduleUserNews, cancelUserSchedule } = require('./scheduler');

async function handleCommand(message, client) {
    const args = message.content.trim().split(/\s+/);
    const command = args.shift();

    if (command === '!뉴스도움말') {
        return message.reply(
            '🆘 뉴스 알림 명령어 도움말:\n' +
            '`!뉴스설정 [키워드] [간격(분)]`: 뉴스 알림 설정\n' +
            '`!뉴스설정취소`: 뉴스 알림 해제\n' +
            '`!뉴스목록`: 현재 설정된 뉴스 알림 목록'
        );
    }

    else if (command === '!뉴스설정') {
        const keyword = args[0];
        const intervalStr = args[1];
        const interval = parseInt(intervalStr);

        if (!keyword || isNaN(interval) || interval <= 0) {
            return message.reply('❗ 사용법: `!뉴스설정 [키워드] [간격(분)]`\n예: `!뉴스설정 경제 30`');
        }

        await saveUserSetting(message.author.id, keyword, interval);
        cancelUserSchedule(message.author.id);
        scheduleUserNews(message.author, keyword, interval);

        return message.reply(`✅ '${keyword}' 뉴스가 ${interval}분마다 전송되도록 설정되었습니다.`);
    }

    else if (command === '!뉴스설정취소') {
        cancelUserSchedule(message.author.id);
        await deleteUserSetting(message.author.id);
        return message.reply('🛑 뉴스 알림이 해제되었습니다.');
    }

    else if (command === '!뉴스목록') {
        try {
            const allSettings = await loadUserSettings();
            const userSetting = allSettings?.[message.author.id];

            if (!userSetting) {
                return message.reply('ℹ️ 현재 설정된 뉴스 알림이 없습니다.');
            }

            return message.reply(
                `🗂 현재 뉴스 알림 설정:\n- 키워드: ${userSetting.keyword}\n- 주기: ${userSetting.interval}분`
            );
        } catch (err) {
            console.error('뉴스목록 처리 중 오류:', err);
            return message.reply('❗ 뉴스 설정을 확인하는 중 문제가 발생했습니다.');
        }
    }


    else {
        return message.reply('❗ 잘못된 명령어입니다. `!뉴스도움말`을 입력하여 도움말을 확인하세요.');
    }
}

module.exports = { handleCommand };
