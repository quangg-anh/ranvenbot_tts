const { EmbedBuilder, PermissionsBitField } = require('discord.js'); // Cập nhật import ở đây
const fs = require('fs');
const path = require('path');

module.exports = {
  name: "nsfwset",
  description: "Thiết lập kênh hiện tại là kênh NSFW.",
  category: "Admin",
  usage: `nsfwset`,
  run: async (client, message) => {
    // Kiểm tra quyền admin
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return message.reply('Bạn không có quyền để thực hiện lệnh này.');
    }

    // Đường dẫn đến tập tin chứa ID kênh NSFW
    const nsfwChannelsPath = path.join(__dirname, 'nsfwChannels.json');
    let nsfwChannels = {};

    try {
      // Đọc tập tin JSON
      if (fs.existsSync(nsfwChannelsPath)) {
        const data = fs.readFileSync(nsfwChannelsPath, 'utf8');
        nsfwChannels = JSON.parse(data);
      }
    } catch (error) {
      console.error('Error reading or parsing nsfwChannels.json:', error);
      nsfwChannels = {}; // Nếu có lỗi, sử dụng đối tượng trống
    }

    // Cập nhật ID kênh NSFW cho server hiện tại
    nsfwChannels[message.guild.id] = message.channel.id;
    
    try {
      // Ghi lại tập tin JSON
      fs.writeFileSync(nsfwChannelsPath, JSON.stringify(nsfwChannels, null, 2));
      
      // Phản hồi thành công
      const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('Kênh NSFW Được Thiết Lập')
        .setDescription(`Kênh hiện tại đã được thiết lập thành kênh NSFW: <#${message.channel.id}>`);
      
      message.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error writing nsfwChannels.json:', error);
      message.reply('Đã xảy ra lỗi khi thiết lập kênh NSFW.');
    }
  },
};
