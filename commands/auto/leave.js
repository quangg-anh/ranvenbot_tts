const { getVoiceConnection } = require('@discordjs/voice');

function handleLeaveCommand(message) {
    if (!message.guild) return;
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
        return message.channel.send("Bạn phải ở trong một kênh thoại để sử dụng lệnh này ❌.");
    }

    const connection = getVoiceConnection(message.guild.id);
    if (connection) {
        message.react('✅').then(() => {
            connection.destroy();
            message.channel.send("Đã rời khỏi kênh thoại ✔.");
        }).catch(err => {
            console.error('Failed to react to message:', err);
            message.channel.send("Không thể thêm reaction. Nhưng bot sẽ vẫn rời khỏi kênh thoại.");
            connection.destroy();
        });
    } else {
        message.channel.send("Bot không kết nối với bất kỳ kênh thoại nào ❌.");
    }
}

async function run(client, message, args) {
    handleLeaveCommand(message);
}

module.exports = {
    run
};
