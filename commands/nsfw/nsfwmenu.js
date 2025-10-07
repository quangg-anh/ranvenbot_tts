const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  name: "nsfwmenu",
  description: "Get full NSFW List",
  usage: `+nsfwmenu`,
  run: async (client, message, args) => {
    // Giả sử NSFWstatus là một giá trị có sẵn từ cấu hình hoặc cơ sở dữ liệu
    const NSFWstatus = await getNSFWStatus(message.guild.id); // Ví dụ: Hàm lấy trạng thái NSFW từ cơ sở dữ liệu hoặc tệp cấu hình

    if (NSFWstatus === 'false') {
      return message.reply(`This group is not NSFW enabled!\n\nTo configure NSFW mode, type:\n\n*${prefix}nsfw*`);
    }

    // Đường dẫn đến thư mục chứa các tệp lệnh
    const commandsPath = path.join(__dirname, './');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    // Tạo embed cho menu
    const embed = new EmbedBuilder()
      .setAuthor({ name: 'Nsfw Menu', iconURL: 'https://cdn.discordapp.com/avatars/1247771676809105480/e970256c868d1911b5361f73df638ba5.png', url: 'https://quanganhdeveloper.link' })
      .setColor('#0099ff')
      .setDescription('Danh sách các lệnh NSFW')
      .setFooter({ text: 'Copyright @Ravenbot2024', iconURL: 'https://cdn.discordapp.com/avatars/1247771676809105480/e970256c868d1911b5361f73df638ba5.png' });

    // Đọc và thêm thông tin từ các tệp lệnh
    for (const file of commandFiles) {
      const command = require(path.join(commandsPath, file));
      if (command.category === 'Nsfw') {
        embed.addFields({
          name: command.name,
          value: `Description: ${command.desc}\nUsage: \`${command.usage}\``,
        });
      }
    }

    // Gửi menu
    await message.reply({ embeds: [embed] });
  }
};

// Giả sử bạn có hàm để lấy trạng thái NSFW từ cơ sở dữ liệu hoặc cấu hình
async function getNSFWStatus(guildId) {
  // Ví dụ lấy trạng thái từ tệp JSON hoặc cơ sở dữ liệu
  // Trả về 'true' hoặc 'false'
  const nsfwChannelsPath = path.join(__dirname, 'nsfwChannels.json');
  const nsfwChannels = require(nsfwChannelsPath);
  // Giả sử trạng thái NSFW là true hoặc false từ cấu hình
  return nsfwChannels[guildId] ? 'true' : 'false';
}
