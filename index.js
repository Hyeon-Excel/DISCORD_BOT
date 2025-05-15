require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { loadUserSettings } = require('./storage');
const { scheduleUserNews } = require('./scheduler');
const { handleCommand } = require('./commands');

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}`);
    const settings = await loadUserSettings();
    for (const [userId, config] of Object.entries(settings)) {
        const user = await client.users.fetch(userId);
        scheduleUserNews(user, config.keyword, config.interval);
    }
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    await handleCommand(message, client);
});

client.login(process.env.DISCORD_TOKEN);