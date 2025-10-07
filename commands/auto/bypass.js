const axios = require('axios');
const { EmbedBuilder } = require('discord.js');

async function handleBypassCommand(message, args) {
    if (args.length === 0) {
        return message.reply("Hãy cung cấp một liên kết để bypass ❌.");
    }

    const linkToBypass = args.join(' ');

    const startTime = Date.now(); // Ghi lại thời gian bắt đầu

    try {
        const response = await axios.post('https://bypassunlockapi-eqyp.onrender.com/bypass', {
            link: linkToBypass
        }, {
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Accept-Encoding': 'gzip, deflate, br, zstd',
                'Accept-Language': 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5',
                'Content-Type': 'application/json',
                'DNT': '1',
                'Origin': 'https://bypassunlock.com',
                'Referer': 'https://bypassunlock.com/',
                'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604'
            }
        });

        const endTime = Date.now(); // Ghi lại thời gian kết thúc
        const elapsedTime = ((endTime - startTime) / 1000).toFixed(2); // Tính thời gian thực hiện

        if (response.data && response.data.bypassed) {
            const bypassedLink = response.data.bypassed;

            const embed = new EmbedBuilder()
                .setColor(0x57F287) // Màu xanh lá
                .setTitle("✅ Linkvertise đã bypass thành công")
                .addFields(
                    { name: "🔗 Link Đã Bypass", value: `[Nhấn vào đây](${bypassedLink})`, inline: false },
                    { name: "⏳ Thời gian bypass", value: `${elapsedTime} giây`, inline: false }
                )
                .setFooter({ text: `Bot làm bởi: ${message.author.tag}`, iconURL: message.author.displayAvatarURL() });

                message.reply({ embeds: [embed] });
        } else {
            message.reply("Không thể bypass liên kết. Hãy thử lại sau ❌.");
        }
    } catch (error) {
        console.error('Error while bypassing link:', error);
        message.reply("Đã xảy ra lỗi khi bypass liên kết ❌.");
    }
}

async function run(client, message, args) {
    handleBypassCommand(message, args);
}

module.exports = {
    name: 'Bypass',
    description: 'bypass linkverties',
    run
};
