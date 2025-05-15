const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('뉴스설정')
        .setDescription('뉴스 키워드와 간격을 설정합니다.')
        .addStringOption(option =>
            option.setName('키워드')
                .setDescription('뉴스 키워드 (예: 경제, IT 등)')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('간격')
                .setDescription('뉴스 알림 간격 (분)')
                .setRequired(true)),

    async execute(interaction) {
        const keyword = interaction.options.getString('키워드');
        const interval = interaction.options.getInteger('간격');

        if (interval <= 0) {
            return interaction.reply({ content: '❗ 간격은 1 이상이어야 합니다.', ephemeral: true });
        }

        const { saveUserSetting } = require('../storage');
        const { scheduleUserNews, cancelUserSchedule } = require('../scheduler');

        await saveUserSetting(interaction.user.id, keyword, interval);
        cancelUserSchedule(interaction.user.id, keyword);
        scheduleUserNews(interaction.user, keyword, interval);

        return interaction.reply({
            content: `✅ '${keyword}' 뉴스가 ${interval}분마다 전송되도록 설정되었습니다.`,
            ephemeral: true
        });
    }
};
