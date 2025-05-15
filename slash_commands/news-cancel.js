const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('뉴스해제')
        .setDescription('뉴스 알림을 해제합니다.')
        .addStringOption(option =>
            option.setName('키워드')
                .setDescription('해제할 뉴스 키워드 (생략 시 전체 해제)')
                .setRequired(false)),

    async execute(interaction) {
        const keyword = interaction.options.getString('키워드');
        const { deleteUserSetting } = require('../storage');
        const { cancelUserSchedule } = require('../scheduler');

        await deleteUserSetting(interaction.user.id, keyword);
        cancelUserSchedule(interaction.user.id, keyword);

        if (keyword) {
            return interaction.reply({ content: `🛑 '${keyword}' 뉴스 알림이 해제되었습니다.`, ephemeral: true });
        } else {
            return interaction.reply({ content: '🛑 모든 뉴스 알림이 해제되었습니다.', ephemeral: true });
        }
    }
};
