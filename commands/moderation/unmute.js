const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'unmute',
    description: 'Unmute một member (Dành cho onwer)',
    run: async (client, message, args) => {
        const configPath = path.join(__dirname, './../../config.json');
        const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        const OWNER_ID = config.ownerId;

        if (message.author.id !== OWNER_ID) {
            return message.reply('Bạn không có quyền sử dụng lệnh này.');
        }

        const member = message.mentions.members.first();
        if (!member) {
            return message.reply('Bạn cần đề cập đến thành viên để unmute.');
        }

        const mutedRole = message.guild.roles.cache.find(role => role.name === 'Muted');
        if (mutedRole && member.roles.cache.has(mutedRole.id)) {
            await member.roles.remove(mutedRole);
            message.reply(`${member.user.tag} đã được unmute.`);
        } else {
            message.reply(`${member.user.tag} không bị mute.`);
        }
    },
};
