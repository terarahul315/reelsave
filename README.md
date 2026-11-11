# ⚡ ReelSave — Instagram Reels, Audio & Story Downloader (PWA)

[[https://img.shields.io/badge/Vercel-Deployed-black?style=for-the-badge&logo=vercel]](https://reelsave-rouge.vercel.app/)
[[https://img.shields.io/badge/PWA-Installable-purple?style=for-the-badge&logo=pwa]](https://reelsave-rouge.vercel.app/)
[[https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge]](https://opensource.org/licenses/MIT)

> A modern, ad-light, mobile-first Progressive Web App (PWA) built with pure HTML5, CSS3, and JavaScript to download public Instagram Reels, extract background MP3 music, and save Stories in lossless 1080p Full HD.

---

## 🚀 Live Demo & Web App

Experience ReelSave live in your browser (no app or login required):  
👉 **[https://reelsave-rouge.vercel.app/](https://reelsave-rouge.vercel.app/)**

---

## ✨ Features

- **🎬 1080p Full HD Video Downloads:** Untouched raw stream fetched directly from Instagram CDN with dual-server failover.
- **🎵 1-Click MP3 Audio Extraction:** Dedicated background music and audio track downloader.
- **📸 Stories & Highlights Support:** Clean extraction for public posts and stories.
- **📱 PWA Enabled:** Install directly to your phone's home screen via Chrome without any APK.
- **🔒 Privacy First & Secure:** Zero logins, zero passwords stored, with a secure Vercel Serverless proxy backend (`/api/download`).
- **⚡ Zero Lag & Mobile First:** Pure semantic web architecture running smoothly at 60 FPS on any Android, iOS, or PC browser.

---

## 🛠️ Architecture & Tech Stack

- **Frontend:** Semantic HTML5, Custom Properties CSS3 (Dark Aurora Glassmorphism), Modular JavaScript (ES6+).
- **Backend / API:** Vercel Serverless Functions (`api/download.js`), Node.js fetch runtime.
- **PWA Capabilities:** Web App Manifest (`manifest.json`), Network-First Service Worker (`sw.js`).
- **Hosting & CI/CD:** Vercel Global Edge Network connected with GitHub CI/CD.

---

## 💻 Local Development Setup

Clone the repository and test locally:

```bash
git clone [https://github.com/terarahul315/reelsave.git](https://github.com/terarahul315/reelsave.git)
cd reelsave
