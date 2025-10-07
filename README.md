# 🔊 Raven Bot — Discord TTS & Soundboard Bot

Raven Bot là một bot Discord đa năng hỗ trợ **Text-to-Speech (TTS)**, phát **soundboard tùy chỉnh**, và quản lý server cơ bản.  
Được xây dựng bằng **discord.js v14** và **@discordjs/voice**.

---

## ✨ Tính năng
- 🎙️ **Text-to-Speech (TTS)**: đọc văn bản thành giọng nói trong voice channel (Google TTS / Google Cloud TTS).  
- 🔊 **Soundboard**: phát file âm thanh định nghĩa trong `sounds.json`.  
- 🏓 **Ping test**: kiểm tra độ trễ mạng giữa bot và server.  
- 📊 **Status auto-update**: hiển thị số servers và members trực tiếp【42†source】.  
- 🔧 **Tiện ích**: format dung lượng, số đẹp (`functions.js`)【45†source】.  

---

## 🧰 Tech Stack
- Node.js 18+  
- discord.js v14【47†source】  
- @discordjs/voice【47†source】  
- google-tts-api【47†source】  
- @google-cloud/text-to-speech【47†source】  
- ping, moment, axios, say, ipify, public-ip【47†source】  

---

## ⚙️ Cài đặt

### 1) Clone & Cài đặt
```bash
git clone https://github.com/<yourname>/<repo>.git
cd <repo>
npm install
```

### 2) Config
File `config.json` chứa token bot và ID owner【43†source】:
```json
{
  "token": "your_discord_bot_token",
  "ownerId": "your_discord_user_id"
}
```

File `sounds.json` chứa map tên → file âm thanh【48†source】:
```json
{
  "votay": "./data/playdata/votay.mp3",
  "bomay": "./data/playdata/bomay.mp3"
}
```

### 3) Chạy bot
```bash
node bot.js
```

---

## 📜 Commands

Bot sử dụng prefix `_`【44†source】

- `_ping` → Kiểm tra kết nối  
- `_say <text>` → Bot đọc văn bản bằng TTS  
- `_join` → Tham gia voice channel  
- `_leave` → Rời voice channel  
- `_sound <name>` → Phát âm thanh từ `sounds.json`  

*(Các lệnh load tự động từ thư mục `commands/`)【44†source】*

---

## 📦 Scripts
Trong `package.json` bạn có thể thêm【47†source】:
```json
{
  "scripts": {
    "start": "node bot.js",
    "dev": "nodemon bot.js"
  }
}
```

---

## 📂 Cấu trúc thư mục
```
.
├── bot.js            # Điểm vào chính, load commands và event【44†source】
├── config.json       # Config token, owner【43†source】
├── functions.js      # Hàm tiện ích (formatBytes, laysodep)【45†source】
├── updateStatus.js   # Hàm update presence, server count【42†source】
├── sounds.json       # Danh sách file soundboard【48†source】
├── package.json
├── package-lock.json
└── commands/         # Các file command
```

---

## 🚀 Roadmap
- [ ] Thêm lệnh slash (`/say`, `/sound`)  
- [ ] Hệ thống queue cho TTS dài  
- [ ] Soundboard UI + select menu  
