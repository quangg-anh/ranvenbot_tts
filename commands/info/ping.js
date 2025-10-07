const axios = require('axios');

async function run(client, message, args) {
    const msg = await message.channel.send(`🏓 Pinging....`);
    try {
        // Fetch server IP
        const ipResponse = await axios.get('https://api.ipify.org/');
        const ip = ipResponse.data;

        // Fetch location info
        const locationResponse = await axios.get(`https://ipinfo.io/${ip}/json`);
        const data = locationResponse.data;

        await axios.get('https://srhpyqt94yxb.statuspage.io/api/v2/components.json').then(response => {
            let api = response.data.components.filter(el => el.name == "API");
            api = api[0];
            const latencyBot = Math.floor(msg.createdTimestamp - message.createdTimestamp);
            const latencyAPI = client.ws.ping;
            const locationInfo = `Vị trí hosting: ${data.city}, ${data.region}, ${data.country}`;
            const discordAPIStatus = `Discord API status: ${api.status}`;

            const responseMessage = `Pong! 🏓\nĐộ trễ (bot): ${latencyBot}ms\nĐộ trễ (API): ${latencyAPI}ms\n${discordAPIStatus}\n${locationInfo}`;

            msg.edit(responseMessage);
        });
    } catch (error) {
        console.error('Error fetching location info:', error);
        const latencyBot = Math.floor(msg.createdTimestamp - message.createdTimestamp);
        const latencyAPI = client.ws.ping;
        const locationInfo = 'Vị trí hosting: Không thể xác định';
        const responseMessage = `Pong! 🏓\nĐộ trễ (bot): ${latencyBot}ms\nĐộ trễ (API): ${latencyAPI}ms\n${locationInfo}`;
        msg.edit(responseMessage);
    }
}

module.exports = {
    name: 'ping',
    description: 'Kiểm tra ping của bot.',
    run
};
