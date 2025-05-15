require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { loadUserSettings } = require('./storage');
const { scheduleUserNews } = require('./scheduler');
const { handleCommand } = require('./commands');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once('ready', async () => {
    console.log(`✅ Logged in as ${client.user.tag}`);

    // 사용자 설정 로드 및 스케줄 등록
    const settings = await loadUserSettings();
    for (const [userId, config] of Object.entries(settings)) {
        try {
            const user = await client.users.fetch(userId);
            scheduleUserNews(user, config.keyword, config.interval);
            console.log(`📨 ${user.tag} - '${config.keyword}' (${config.interval}분 간격) 스케줄 등록됨`);
        } catch (error) {
            console.error(`❌ 사용자 ${userId} 불러오기 실패:`, error.message);
        }
    }
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    await handleCommand(message, client);
});

client.login(process.env.DISCORD_TOKEN);
