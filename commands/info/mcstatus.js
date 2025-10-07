const fetch = require('node-fetch');
const { EmbedBuilder } = require('discord.js'); // Correct import for discord.js v14

module.exports = {
    name: 'mcstatus',
    description: 'Kiểm tra trạng thái server Minecraft.',
    run: async (client, message, args) => {
        if (args.length < 1) {
            return message.reply('Bạn cần cung cấp địa chỉ IP của server Minecraft.\nVí dụ: +serverstatus <ip>');
        }

        const serverIp = args[0];
        const apiUrl = `https://api.mcsrvstat.us/3/${serverIp}`;

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();

            if (result.online) {
                const playersOnline = result.players.online;
                const playersMax = result.players.max;
                const version = result.version;
                const motd = result.motd.clean.join('\n');
                const ping = result.ping || 'N/A';
                const software = result.software || 'N/A';

                // Debug information
                const debug = result.debug || {};
                const srv = debug.srv ? 'Yes' : 'No';

                const embed = new EmbedBuilder()
                    .setColor('#0099ff')
                    .setAuthor({ name: 'Raven Bot', iconURL: 'https://cdn.discordapp.com/avatars/1247771676809105480/e970256c868d1911b5361f73df638ba5.png', url: 'https://quanganhdeveloper.link' })
                    .setThumbnail('https://seeklogo.com/images/M/minecraft-youtube-logo-448E10AC2B-seeklogo.com.png')
                    .setFooter({ text: 'Copyright @Ravenbot2024', iconURL: 'https://cdn.discordapp.com/avatars/1247771676809105480/e970256c868d1911b5361f73df638ba5.png' })
                    .setTitle(`Minecraft Server Status`)
                    .addFields(
                        { name: 'Server IP', value: serverIp, inline: true },
                        { name: 'Status', value: 'Online', inline: true },
                        { name: 'Version', value: version, inline: true },
                        { name: 'Players', value: `${playersOnline}/${playersMax}`, inline: true },
                        { name: 'MOTD', value: motd, inline: true },
                        { name: 'Ping', value: `${ping} ms`, inline: true },
                        { name: 'Software', value: software, inline: true },
                        { name: 'SRV Record', value: srv, inline: true },
                    );

                message.reply({ embeds: [embed] });
            } else {
                message.reply(`Server **${serverIp}** hiện đang offline.`);
            }
        } catch (error) {
            console.error(error);
            message.reply(`Không thể kết nối tới server **${serverIp}**. Chi tiết lỗi: ${error.message}`);
        }
    },
};
