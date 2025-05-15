const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('뉴스목록')
        .setDescription('현재 설정된 뉴스 알림 목록을 확인합니다.'),

    async execute(interaction) {
        const { loadUserSettings } = require('../storage');

        try {
            const allSettings = await loadUserSettings();
            const userSettings = allSettings?.[interaction.user.id];

            if (!userSettings || userSettings.length === 0) {
                return interaction.reply({ content: 'ℹ️ 현재 설정된 뉴스 알림이 없습니다.', ephemeral: true });
            }

            const list = userSettings
                .map(s => `- ${s.keyword} (${s.interval}분)`)
                .join('\n');

            return interaction.reply({
                content: `🗂 현재 뉴스 알림 설정 목록:\n${list}`,
                ephemeral: true
            });

        } catch (err) {
            console.error('뉴스목록 처리 중 오류:', err);
            return interaction.reply({
                content: '❗ 뉴스 설정을 확인하는 중 문제가 발생했습니다.',
                ephemeral: true
            });
        }
    }
};
