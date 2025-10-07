const { version, license } = require('../../package.json');
const { utc } = require('moment');
const os = require('os');
const { version: djsversion, EmbedBuilder } = require('discord.js');
const { formatBytes, laysodep } = require('../../functions');

module.exports = {
    cooldown: 10,
    name: 'botinfo',
    category: 'info',
    description: 'Show info của bot.',
    usage: 'botinfo',
    run: async (client, message, args) => {
        const core = os.cpus()[0];
        
        const embed = new EmbedBuilder()
            .setAuthor({ name: 'Raven System Infomation', iconURL: 'https://cdn.discordapp.com/avatars/1247771676809105480/e970256c868d1911b5361f73df638ba5.png', url: 'https://quanganhdeveloper.link' })
            .setFooter({ text: 'Copyright @Ravenbot2024', iconURL: 'https://cdn.discordapp.com/avatars/1247771676809105480/e970256c868d1911b5361f73df638ba5.png' })
            .setImage('https://techcrunch.com/wp-content/uploads/2023/03/router-blinking-lights-smaller-filesize.gif')
            .setColor('#6e02c7')
            .addFields(
                { name: 'Tên bot', value: `${client.user.tag} (${client.user.id})` },
                { name: 'Ngày tạo bot', value: utc(client.user.createdTimestamp).format('MM/DD/YYYY HH:mm:ss'), inline: false },
                { name: 'Server', value: laysodep(client.guilds.cache.size).toString(), inline: true }, 
                { name: 'Channels', value: laysodep(client.channels.cache.size).toString(), inline: true },
                { name: 'Users', value: laysodep(client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)).toString(), inline: true },    
                { name: 'Node.js version', value: process.version, inline: true },
                { name: 'Discord.js version', value: `v${djsversion}`, inline: true },
                { name: 'Bot version', value: `v${version}`, inline: true },
                { name: 'CPU Cores', value: os.cpus().length.toString(), inline: true },
                { name: 'CPU Model', value: core.model, inline: true },
                { name: 'CPU Speed', value: `${core.speed}MHz`, inline: true },
                { name: 'Memory Total', value: formatBytes(process.memoryUsage().heapTotal), inline: true },
                { name: 'Memory Used', value: formatBytes(process.memoryUsage().heapUsed), inline: true },
                {name: 'Platform', value: process.platform, inline: true },
                { name: 'Hostname', value: os.hostname(), inline: false }
            );

        message.channel.send({ embeds: [embed] });
    }
};
