const { ActivityType } = require('discord.js');

let servers = 0;
let servercount = 0;

const updateStatus = (client) => {
    const activities = [
        `Type _help | ${servers} servers`,
        `Invite me! | Watching ${servercount} members`
    ];
    const status = activities[Math.floor(Math.random() * activities.length)];
    client.user.setPresence({
        status: 'idle',
        activities: [{
            type: ActivityType.Custom,
            name: 'customname',
            state: status
        }]
    });
};

const setServers = (client) => {
    servers = client.guilds.cache.size;
};

const setServerCount = (client) => {
    servercount = client.guilds.cache.reduce((a, b) => a + b.memberCount, 0);
};

const registerEventHandlers = (client) => {
    client.on('guildCreate', () => {
        setServers(client);
        setServerCount(client);
        updateStatus(client);
    });

    client.on('guildDelete', () => {
        setServers(client);
        setServerCount(client);
        updateStatus(client);
    });

    client.on('guildMemberAdd', () => {
        setServerCount(client);
        updateStatus(client);
    });

    client.on('guildMemberRemove', () => {
        setServerCount(client);
        updateStatus(client);
    });
};

module.exports = { updateStatus, setServers, setServerCount, registerEventHandlers };
