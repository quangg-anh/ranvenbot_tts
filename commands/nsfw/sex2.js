const axios = require('axios');
const path = require('path'); // Khai báo path
const { AttachmentBuilder } = require('discord.js'); // Đảm bảo sử dụng đúng cách

module.exports = {
  name: "sex2",
  desc: "Hentai picture of waifu sex", 
  category: 'Nsfw',
  usage: `+sex2`,
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
      const response = await axios.get('https://fantox-apis.vercel.app/sex2');
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