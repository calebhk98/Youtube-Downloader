# YouTube Downloader - Local Backend Server

This directory contains the Node.js server that works with the Chrome Extension. Its only job is to receive a YouTube URL, find the best quality version, and download it to your computer's "Downloads" folder.

## Setup and Running

To get the server running as a background service that starts on boot, we will use [PM2](https://pm2.keymetrics.io/), a powerful process manager for Node.js.

### 1. Initial Setup

First, install the dependencies from the `server` directory.

```sh
# Navigate into this server directory
cd server

# Install dependencies
npm install
```

### 2. Install PM2 Globally

PM2 is best installed globally on your system.

```sh
npm install pm2 -g
```

### 3. Start the Server with PM2

Now you can start the server using PM2.

```sh
# This command starts the server and gives it the name "youtube-downloader"
pm2 start server.js --name "youtube-downloader"
```

The server is now running in the background! You can check its status with `pm2 list` or `pm2 monit`.

### 4. (Optional) Run on System Startup

To make the server start automatically when your computer boots up, run the following command and follow the on-screen instructions.

```sh
pm2 startup
```
PM2 will give you a command that you need to copy and paste back into your terminal. Once you do that, your server process list will be saved and will respawn on reboot.

### Useful PM2 Commands

-   **List all running processes:** `pm2 list`
-   **Monitor processes (CPU/Mem):** `pm2 monit`
-   **View logs for your app:** `pm2 logs youtube-downloader`
-   **Stop the server:** `pm2 stop youtube-downloader`
-   **Restart the server:** `pm2 restart youtube-downloader`
-   **Delete the server from PM2:** `pm2 delete youtube-downloader`
-   **Save the process list for startup:** `pm2 save`
