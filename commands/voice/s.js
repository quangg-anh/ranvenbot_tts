const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

async function textToSpeech(voiceChannel, text, speed = 1.2) {
    const ttsDataDir = path.join(__dirname, 'data', 'ttsdata');
    if (!fs.existsSync(ttsDataDir)) {
        fs.mkdirSync(ttsDataDir, { recursive: true });
    }

    speed = Math.max(0.25, Math.min(speed, 4.0));

    const response = await fetch(`https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=vi&q=${encodeURIComponent(text)}&ttsspeed=${speed}`);
    if (!response.ok) {
        throw new Error('Failed to fetch TTS audio from Google Translate');
    }
    
    const audioStream = fs.createWriteStream(path.join(ttsDataDir, `${voiceChannel.guild.id}.mp3`));
    response.body.pipe(audioStream);
    
    audioStream.on('finish', () => {
        const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: voiceChannel.guild.id,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator,
        });

        const player = createAudioPlayer();
        const resource = createAudioResource(path.join(ttsDataDir, `${voiceChannel.guild.id}.mp3`));
        player.play(resource);
        connection.subscribe(player);
    });
}

async function run(client, message, args) {
    const text = args.join(' ');
    if (!text) return message.reply('Hãy nhập văn bản bạn muốn đọc.');

    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.reply('Bạn phải ở trong kênh thoại để sử dụng lệnh này.');

    try {
        await textToSpeech(voiceChannel, text);
    } catch (error) {
        message.reply('Có lỗi xảy ra khi xử lý TTS.');
        console.error(error);
    }
}

module.exports = {
    name: 's',
    description: 'Chuyển văn bản thành giọng nói.',
    run
};
