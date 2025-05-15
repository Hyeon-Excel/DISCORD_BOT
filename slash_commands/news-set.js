const { SlashCommandBuilder, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('뉴스설정')
        .setDescription('뉴스 키워드와 간격, 알림 채널을 설정합니다.')
        .addStringOption(option =>
            option.setName('키워드')
                .setDescription('뉴스 키워드 (예: 경제, IT 등)')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('간격')
                .setDescription('뉴스 알림 간격 (분)')
                .setRequired(true))
        .addChannelOption(option =>
            option.setName('채널')
                .setDescription('뉴스 알림을 받을 채널')
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(false)),

    async execute(interaction) {
        const keyword = interaction.options.getString('키워드');
        const interval = interaction.options.getInteger('간격');
        const channel = interaction.options.getChannel('채널'); // optional

        if (interval <= 0) {
            return interaction.reply({ content: '❗ 간격은 1 이상이어야 합니다.', ephemeral: true });
        }

        const { saveUserSetting } = require('../storage');
        const { scheduleUserNews, cancelUserSchedule } = require('../scheduler');

        await saveUserSetting(interaction.user.id, keyword, interval, channel?.id);
        cancelUserSchedule(interaction.user.id, keyword);
        scheduleUserNews(interaction.user, keyword, interval, channel?.id);

        return interaction.reply({
            content: `✅ '${keyword}' 뉴스가 ${interval}분마다 ${channel ? `<#${channel.id}>` : 'DM'}으로 전송되도록 설정되었습니다.`,
            ephemeral: true
        });
    }
};
