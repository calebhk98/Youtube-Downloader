const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const path = require('path');
const fs = require('fs');
const os = require('os');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json()); // Middleware to parse JSON bodies

// Function to find the user's Downloads directory
const getDownloadsFolder = () => {
  return path.join(os.homedir(), 'Downloads');
};

// Endpoint to start a video download
app.post('/download-video', async (req, res) => {
  const { url } = req.body;
  if (!url || !ytdl.validateURL(url)) {
    return res.status(400).json({ error: 'Invalid or missing YouTube URL' });
  }

  try {
    const downloadsPath = getDownloadsFolder();
    // Ensure the Downloads directory exists
    if (!fs.existsSync(downloadsPath)) {
      fs.mkdirSync(downloadsPath, { recursive: true });
    }

    const info = await ytdl.getInfo(url);
    const title = info.videoDetails.title;
    // Sanitize filename to remove characters that are invalid in file systems
    const sanitizedTitle = title.replace(/[\\/?%*:|"<>]/g, '-').replace(/[^\x00-\x7F]/g, "");
    const videoPath = path.join(downloadsPath, `${sanitizedTitle}.mp4`);

    // Choose the best format with both video and audio
    const format = ytdl.chooseFormat(info.formats, { 
      quality: 'highestvideo',
      filter: 'videoandaudio' 
    });

    if (!format) {
      return res.status(404).json({ error: 'No suitable video format with audio found.' });
    }

    // Start download stream and pipe to file
    const videoStream = ytdl(url, { format });
    videoStream.pipe(fs.createWriteStream(videoPath));

    let responseSent = false; // Flag to prevent sending response twice

    videoStream.on('end', () => {
      if (responseSent) return;
      console.log(`Finished downloading: ${sanitizedTitle}.mp4`);
      res.status(200).json({ message: 'Download completed successfully!', filename: `${sanitizedTitle}.mp4` });
      responseSent = true;
    });

    videoStream.on('error', (err) => {
      if (responseSent) return;
      console.error(`Error downloading ${sanitizedTitle}.mp4:`, err);
      res.status(500).json({ error: 'A download stream error occurred.' });
      responseSent = true;
    });
    
  } catch (error) {
    if (!res.headersSent) {
      console.error('Error initiating download:', error);
      res.status(500).json({ error: 'Failed to start download.' });
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});