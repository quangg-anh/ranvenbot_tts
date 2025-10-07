// commands/info/paping.js
const { EmbedBuilder } = require('discord.js');
const ping = require('ping');

module.exports = {
  name: 'paping',
  description: 'Ping a URL (with optional port) and display the result in an embed.',
  async run(client, message, args) {
    const url = args[0];
    const port = args[1] || null;

    if (!url) {
      return message.reply('Vui lòng cung cấp URL để ping.');
    }

    const fullUrl = port ? `${url}:${port}` : url;

    // Tạo embed và gửi tin nhắn đầu tiên
    const embed = new EmbedBuilder()
      .setTitle('Cmd Pinging 🎯')
      .setDescription('Đang ping...')
      .setColor('#d4002e')
      .setAuthor({ name: 'Raven Command', iconURL: 'https://cdn.discordapp.com/avatars/1247771676809105480/e970256c868d1911b5361f73df638ba5.png', url: 'https://vietartshow.com' })
      .setTimestamp()
      .setFooter({ text: 'Copyright @Ravenbot2024', iconURL: 'https://cdn.discordapp.com/avatars/1247771676809105480/e970256c868d1911b5361f73df638ba5.png' });

    const sentMessage = await message.reply({ embeds: [embed] });

    let pingResults = [];
    const maxResults = 4; // Số lượng ping gần nhất
    const startTime = Date.now();
    const timeout = 60000; // 60 giây

    const interval = setInterval(async () => {
      if (Date.now() - startTime >= timeout) {
        clearInterval(interval);

        // Tính toán kết quả ping trung bình và thống kê
        const averagePing = pingResults.length ? (pingResults.reduce((a, b) => a + b, 0) / pingResults.length).toFixed(2) : 'N/A';
        const minPing = pingResults.length ? Math.min(...pingResults).toFixed(2) : 'N/A';
        const maxPing = pingResults.length ? Math.max(...pingResults).toFixed(2) : 'N/A';
        const packetLoss = pingResults.length ? 0 : 'N/A'; // Có thể tính toán packet loss nếu cần

        // Tạo chuỗi hiển thị các ping gần nhất theo định dạng bảng
        const lastPings = pingResults.length
          ? pingResults.slice(-maxResults).map((p, i) => `Reply from ${fullUrl}: bytes=32 time=${p.toFixed(2)}ms TTL=57`).join('\n')
          : 'N/A';

        // Tạo mô tả cho embed với định dạng bảng
        const pingDescription = `
Pinging ${fullUrl} with 32 bytes of data:
${lastPings}

Ping statistics for ${fullUrl}:
    Packets: Sent = ${pingResults.length}, Received = ${pingResults.length}, Lost = ${pingResults.length ? 0 : 'N/A'} (0% loss),
Approximate round trip times in milli-seconds:
    Minimum = ${minPing}ms, Maximum = ${maxPing}ms, Average = ${averagePing}ms
        `;

        embed.setDescription(pingDescription);
        embed.setColor('#00d43c')
        sentMessage.edit({ embeds: [embed] });
      } else {
        try {
          const result = await ping.promise.probe(fullUrl);
          // Kiểm tra xem result.time có phải là số không
          if (result.time && !isNaN(result.time)) {
            pingResults.push(parseFloat(result.time)); // Đảm bảo thời gian là số
          }
          // Cập nhật mô tả của embed với kết quả ping gần nhất
          embed.setDescription(`
Pinging ${fullUrl} with 32 bytes of data:
Reply from ${fullUrl}: bytes=32 time=${result.time && !isNaN(result.time) ? result.time.toFixed(2) : 'N/A'}ms TTL=57

Last ${maxResults} pings:
${pingResults.slice(-maxResults).map((p, i) => `Ping ${pingResults.length - i}: ${p.toFixed(2)} ms`).join('\n')}`);
          embed.setColor('#00d43c')
          sentMessage.edit({ embeds: [embed] });
        } catch (error) {
          console.error('Error while pinging:', error);
          embed.setDescription('Đã xảy ra lỗi khi ping.');
          embed.setColor('#d4002e')
          sentMessage.edit({ embeds: [embed] });
        }
      }
    }, 1000); // Ping mỗi giây
  },
};
