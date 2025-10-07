const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { updateStatus, setServers, setServerCount, registerEventHandlers } = require('./updateStatus');
const papingCommand = require('./commands/info/paping'); // Đảm bảo đường dẫn đúng

// Đọc token và ownerId từ config.json
const config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));

// Khởi tạo bot
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent // Đảm bảo rằng intent này được bật trong Discord Developer Portal
    ]
});

const PREFIX = '_'; // Tiền tố cho các lệnh

// Hàm để load các commands từ thư mục
const loadCommands = (dir) => {
    const commands = new Map();
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            const subCommands = loadCommands(filePath);
            for (const [key, value] of subCommands) {
                commands.set(key, value);
            }
        } else if (file.endsWith('.js')) {
            const command = require(filePath);
            const commandName = path.basename(file, '.js');
            commands.set(commandName, command);
        }
    }

    return commands;
};

// Load tất cả các commands
const commands = loadCommands(path.join(__dirname, 'commands'));

client.once('ready', async () => {
    console.log(`Bot đã sẵn sàng!`);

    setServers(client);
    setServerCount(client);
    updateStatus(client);
    setInterval(() => updateStatus(client), 5000); // Cập nhật sau mỗi 5 giây

    // Đăng ký các sự kiện
    registerEventHandlers(client);

    // Log tổng số lệnh và tên các lệnh đã load
    console.log(`Đã load tổng cộng ${commands.size} lệnh:`);
    commands.forEach((_, name) => console.log(`- ${name}`));
});

// Global error handlers
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Network reconnect handlers
client.on('shardReconnecting', (id) => {
    console.log(`Shard ${id} reconnecting...`);
});
client.on('shardResume', (id, replayedEvents) => {
    console.log(`Shard ${id} resumed, replayed ${replayedEvents} events.`);
});

client.on('messageCreate', async message => {
    if (message.content.startsWith(`!${papingCommand.name}`)) {
        const args = message.content.slice(PREFIX.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        if (commands.has(commandName)) {
            const command = commands.get(commandName);
            try {
                await command.run(client, message, args);
            } catch (error) {
                console.error(error);
                message.reply('Có lỗi xảy ra khi thực thi lệnh này!');
            }
        } else {
            message.reply('Lệnh không tồn tại!');
        }
    }

    if (!message.content.startsWith(PREFIX) || message.author.bot) return;

    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (commands.has(commandName)) {
        const command = commands.get(commandName);
        try {
            await command.run(client, message, args);
        } catch (error) {
            console.error(error);
            message.reply('Có lỗi xảy ra khi thực thi lệnh này!');
        }
    } else {
        message.reply('Lệnh không tồn tại!');
    }
});

client.login(config.token);
