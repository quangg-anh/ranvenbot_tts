const axios = require('axios');
const path = require('path');
const { AttachmentBuilder } = require('discord.js'); // Sử dụng AttachmentBuilder

module.exports = {
    name: "nude",
    desc: "Hentai picture of nude waifu", 
    category: 'Nsfw',
    usage: `+nude`,
  run: async (client, message, { prefix, NSFWstatus }) => {
    if (NSFWstatus === 'false') {
      return message.reply(`This group is not NSFW enabled!\n\nTo configure NSFW mode, type:\n\n*${prefix}nsfw*`);
    }

    // Kiểm tra xem kênh hiện tại có phải là kênh NSFW không
    try {
      const nsfwChannelsPath = path.join(__dirname, 'nsfwChannels.json');
      const nsfwChannels = require(nsfwChannelsPath);

      if (nsfwChannels[message.guild.id] !== message.channel.id) {
        return message.reply('Kênh này không phải là kênh NSFW. Vui lòng sử dụng lệnh trong kênh NSFW đã được thiết lập.');
      }

      // Gửi yêu cầu lấy ảnh NSFW
      message.reply('Đang tải ảnh...');
      const response = await axios.get('https://fantox-apis.vercel.app/nude');
      const imgURL = response.data.url;

      // Tạo file đính kèm từ URL ảnh
      const attachment = new AttachmentBuilder(imgURL);

      // Gửi ảnh
      await message.reply({ content: '*Here What you are looking for 👀..*', files: [attachment] });
    } catch (error) {
      console.error('Error sending NSFW content:', error);
      message.reply('Đã xảy ra lỗi khi gửi nội dung NSFW.');
    }
  },
};
