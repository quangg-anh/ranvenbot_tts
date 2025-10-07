const { joinVoiceChannel, createAudioPlayer, createAudioResource, VoiceConnectionStatus } = require('@discordjs/voice');
const { getVoiceConnection } = require('@discordjs/voice');
const fs = require('fs');
const path = require('path');

const sounds = JSON.parse(fs.readFileSync(path.join(__dirname, './../../sounds.json'), 'utf-8'));

async function playSound(voiceChannel, soundName, volume = 0.3) {
    const soundPath = sounds[soundName];

    if (!soundPath || !fs.existsSync(soundPath)) {
        throw new Error(`Sound file "${soundName}" does not exist.`);
    }

    const existingConnection = getVoiceConnection(voiceChannel.guild.id);
    if (existingConnection) {
        const player = createAudioPlayer();
        const resource = createAudioResource(soundPath, { inlineVolume: true });
        resource.volume.setVolume(volume);
        player.play(resource);
        existingConnection.subscribe(player);
        return;
    }

    const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: voiceChannel.guild.id,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    });

    const player = createAudioPlayer();

    await new Promise(resolve => {
        connection.once(VoiceConnectionStatus.Ready, () => {
            const resource = createAudioResource(soundPath, { inlineVolume: true });
            resource.volume.setVolume(volume);
            player.play(resource);
            connection.subscribe(player);
            resolve();
        });
    });
}

async function run(client, message, args) {
    const soundName = args[0];
    if (!soundName) {
        return message.reply('Hãy nhập tên âm thanh muốn phát.');
    }

    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
        return message.reply('Bạn phải ở trong kênh thoại để sử dụng lệnh này.');
    }

    try {
        await playSound(voiceChannel, soundName);
    } catch (error) {
        message.reply(error.message);
    }
}

module.exports = {
    name: 'play',
    description: 'Phát âm 1 âm thanh có sẵn.',
    run
};
