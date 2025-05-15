require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { loadUserSettings } = require('./storage');
const { scheduleUserNews } = require('./scheduler');
const { handleCommand } = require('./commands');
const fs = require('node:fs');
const path = require('node:path');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// 슬래시 커맨드 등록
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'slash_commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if (!command.data || !command.data.name) {
        console.warn(`⚠️ ${file}에 유효한 'data.name'이 없습니다.`);
        continue;
    }

    console.log(`✅ 명령어 등록: ${command.data.name}`);
    client.commands.set(command.data.name, command);
}

client.once('ready', async () => {
    console.log(`✅ Logged in as ${client.user.tag}`);

    // 다중 키워드 설정 로딩
    const settings = await loadUserSettings();
    for (const [userId, configs] of Object.entries(settings)) {
        try {
            const user = await client.users.fetch(userId);
            for (const { keyword, interval } of configs) {
                scheduleUserNews(user, keyword, interval);
                console.log(`📨 ${user.tag} - '${keyword}' (${interval}분 간격) 스케줄 등록됨`);
            }
        } catch (error) {
            console.error(`❌ 사용자 ${userId} 불러오기 실패:`, error.message);
        }
    }
});

// 기존 채팅 명령어
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    await handleCommand(message, client);
});

// 슬래시 커맨드 핸들링
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: '❗ 명령어 실행 중 오류가 발생했습니다.', ephemeral: true });
    }
});

client.login(process.env.DISCORD_TOKEN);