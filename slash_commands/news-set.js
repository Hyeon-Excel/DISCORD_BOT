const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('뉴스설정')
        .setDescription('뉴스 카테고리와 알림 간격, 전송 위치를 설정합니다.')
        .addStringOption(option =>
            option.setName('카테고리')
                .setDescription('뉴스 주제를 선택하세요')
                .setRequired(true)
                .addChoices(
                    { name: '대한민국', value: '대한민국' },
                    { name: '세계', value: '세계' },
                    { name: '비즈니스', value: '비즈니스' },
                    { name: '과학기술', value: '과학기술' },
                    { name: '엔터테인먼트', value: '엔터테인먼트' },
                    { name: '스포츠', value: '스포츠' },
                    { name: '건강', value: '건강' }
                )
        )
        .addStringOption(option =>
            option.setName('주기')
                .setDescription('뉴스 알림 주기를 선택하세요')
                .setRequired(true)
                .addChoices(
                    { name: '실시간', value: '0' },
                    { name: '15분', value: '15' },
                    { name: '30분', value: '30' },
                    { name: '1시간', value: '60' }
                )
        )
        .addStringOption(option =>
            option.setName('위치')
                .setDescription('뉴스 알림 전송 위치')
                .setRequired(true)
                .addChoices(
                    { name: 'DM으로 받기', value: 'dm' },
                    { name: '이 채널로 받기', value: 'here' }
                )
        ),

    async execute(interaction) {
        const keyword = interaction.options.getString('카테고리');
        const intervalStr = interaction.options.getString('주기');
        const interval = parseInt(intervalStr);
        const location = interaction.options.getString('위치');

        if (isNaN(interval) || interval < 0) {
            return interaction.reply({ content: '❗ 유효한 주기를 선택하세요.', ephemeral: true });
        }

        const { saveUserSetting } = require('../storage');
        const { scheduleUserNews, cancelUserSchedule } = require('../scheduler');

        const channelId = (location === 'here') ? interaction.channel.id : null;

        await saveUserSetting(interaction.user.id, keyword, interval, channelId);
        cancelUserSchedule(interaction.user.id, keyword);
        scheduleUserNews(interaction.user, keyword, interval, channelId);

        const intervalMsg = interval === 0 ? '실시간' : `${interval}분마다`;
        const locationMsg = (location === 'here') ? `<#${interaction.channel.id}>` : 'DM';
        return interaction.reply({
            content: `✅ '${keyword}' 뉴스가 ${intervalMsg} ${locationMsg}으로 전송되도록 설정되었습니다.`,
            ephemeral: true
        });
    }
};
