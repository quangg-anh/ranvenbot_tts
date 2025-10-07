const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'help',
    description: 'Liệt kê các lệnh có sẵn.',
    run: async (client, message, args) => {
        // Function to recursively read command files
        const readCommandFiles = (dir) => {
            const results = [];
            const list = fs.readdirSync(dir);

            list.forEach((file) => {
                const filePath = path.join(dir, file);
                const stat = fs.statSync(filePath);

                if (stat && stat.isDirectory()) {
                    results.push(...readCommandFiles(filePath));
                } else if (file.endsWith('.js')) {
                    results.push(filePath);
                }
            });

            return results;
        };

        // Path to the commands directory
        const commandsDir = path.join(__dirname, '../commands');
        const commandFiles = readCommandFiles(commandsDir);

        // Array to hold command information
        const commands = [];

        // Loop through command files and extract name and description
        for (const file of commandFiles) {
            const command = require(file);
            if (command.name && command.description) {
                commands.push({ name: command.name, description: command.description });
            }
        }

        // Split commands into pages with 6 commands per page
        const commandsPerPage = 6;
        const pages = [];
        for (let i = 0; i < commands.length; i += commandsPerPage) {
            const embed = new EmbedBuilder()
            .setTitle('Danh sách các lệnh có sẵn')
            .setAuthor({ name: 'Raven Command', iconURL: 'https://cdn.discordapp.com/avatars/1247771676809105480/e970256c868d1911b5361f73df638ba5.png', url: 'https://quanganhdeveloper.link' })
            .setColor('#0099ff')
            .setImage('https://gocnhoannie.com/wp-content/uploads/2020/07/S%E1%BB%B1-nghi%E1%BB%87p-kh%C3%B4ng-ph%E1%BA%A3i-l%C3%BAc-n%C3%A0o-c%C5%A9ng-l%C3%A0-m%E1%BB%99t-%C4%91%C6%B0%E1%BB%9Dng-th%E1%BA%B3ng.gif')
            .setTimestamp()
            .setFooter({ text: 'Copyright @Ravenbot2024', iconURL: 'https://cdn.discordapp.com/avatars/1247771676809105480/e970256c868d1911b5361f73df638ba5.png' });
            embed.addFields(commands.slice(i, i + commandsPerPage).map(cmd => ({
                name: cmd.name,
                value: cmd.description,
                inline: true
            })));

            pages.push(embed);
        }

        // Create buttons
        const backButton = new ButtonBuilder()
            .setCustomId('back')
            .setLabel('◀️')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(pages.length === 1);

        const nextButton = new ButtonBuilder()
            .setCustomId('next')
            .setLabel('▶️')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(pages.length === 1);

        const row = new ActionRowBuilder().addComponents(backButton, nextButton);

        // Send the first page
        const msg = await message.reply({ embeds: [pages[0]], components: [row] });

        // Create a collector for the buttons
        const filter = (interaction) => interaction.isButton() && interaction.user.id === message.author.id;
        const collector = msg.createMessageComponentCollector({ filter, time: 60000 });

        let currentPage = 0;

        collector.on('collect', async (interaction) => {
            if (interaction.customId === 'next') {
                currentPage = (currentPage + 1) % pages.length;
            } else if (interaction.customId === 'back') {
                currentPage = (currentPage - 1 + pages.length) % pages.length;
            }

            // Update the embed and button states
            const updatedRow = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('back')
                        .setLabel('◀️')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(currentPage === 0),
                    new ButtonBuilder()
                        .setCustomId('next')
                        .setLabel('▶️')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(currentPage === pages.length - 1)
                );

            await interaction.update({ embeds: [pages[currentPage]], components: [updatedRow] });
        });

        collector.on('end', () => {
            msg.edit({ components: [] }).catch(error => console.error('Failed to clear buttons: ', error));
        });
    },
};
