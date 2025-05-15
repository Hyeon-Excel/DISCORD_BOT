const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('뉴스도움말')
        .setDescription('뉴스 알림 봇의 명령어를 안내합니다.'),

    async execute(interaction) {
        return interaction.reply({
            content:
                '🆘 뉴스 알림 명령어 도움말:\n' +
                '• `/뉴스설정 [키워드] [간격]` - 뉴스 키워드와 간격 설정\n' +
                '• `/뉴스해제 [키워드]` - 해당 키워드 해제 (없으면 전체 해제)\n' +
                '• `/뉴스목록` - 현재 설정된 알림 목록 보기\n' +
                '• `/뉴스도움말` - 이 도움말 보기',
            ephemeral: true
        });
    }
};
