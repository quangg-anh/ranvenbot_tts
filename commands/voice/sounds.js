const { EmbedBuilder } = require('discord.js');
const fs = require('fs');

function handleSoundsCommand(message) {
    const soundFiles = JSON.parse(fs.readFileSync('./sounds.json', 'utf-8'));
    const soundList = Object.keys(soundFiles);

    const embed = new EmbedBuilder()
        .setTitle('Danh sách các âm thanh có sẵn')
        .setColor('#0099ff')
        .setDescription(soundList.join(', '));

    message.reply({ embeds: [embed] });
}

async function run(client, message, args) {
    handleSoundsCommand(message);
}

module.exports = {
    name: 'sounds',
    description: 'Hiển thị danh sách âm thanh có sẵn.',
    run
};
