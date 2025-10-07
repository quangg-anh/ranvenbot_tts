const fs = require('fs');
const path = require('path');
const { Permissions } = require('discord.js');

module.exports = {
    name: 'mute',
    description: 'Mute một member (Dành cho onwer)',
    run: async (client, message, args) => {
        const configPath = path.join(__dirname, './../../config.json');
        const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        const OWNER_ID = config.ownerId;

        if (message.author.id !== OWNER_ID) {
            return message.reply('Bạn không có quyền sử dụng lệnh này.');
        }

        const member = message.mentions.members.first();
        if (!member) {
            return message.reply('Bạn cần đề cập đến thành viên để mute.');
        }

        let mutedRole = message.guild.roles.cache.find(role => role.name === 'Muted');
        if (!mutedRole) {
            try {
                mutedRole = await message.guild.roles.create({
                    name: 'Rọ Mõm ❌',
                    permissions: []
                });

                // Set permissions for the muted role
                message.guild.channels.cache.forEach(async (channel) => {
                    await channel.permissionOverwrites.create(mutedRole, {
                        SEND_MESSAGES: false,
                        SPEAK: false,
                        VIEW_CHANNEL: true
                    });
                });

                // Optionally, you can set additional permissions for specific channels here
                // For example:
                // const specificChannel = message.guild.channels.cache.find(channel => channel.name === 'specific-channel-name');
                // await specificChannel.permissionOverwrites.create(mutedRole, {
                //     SEND_MESSAGES: false,
                //     SPEAK: false,
                //     VIEW_CHANNEL: true
                // });
            } catch (error) {
                console.error(error);
                return message.reply('Có lỗi xảy ra khi tạo vai trò Muted.');
            }
        }

        // Add the muted role to the member
        await member.roles.add(mutedRole);
        message.reply(`${member.user.tag} đã bị mute.`);
    },
};
