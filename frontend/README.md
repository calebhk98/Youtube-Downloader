# YouTube Downloader - Chrome Extension

This directory contains the frontend for the YouTube Downloader, which is a Google Chrome Extension. It provides a simple button in your browser to send the current YouTube video's URL to your local backend server for download.

## Requirements

For this extension to function, the local backend server **must be running**. The backend is located in the `server` directory of this project. Please follow the instructions in `server/README.md` to start it before using this extension.

## Setup and Installation

Installing a local extension in Chrome requires a few manual steps.

### Step 1: Rename the Manifest File

The file that tells Chrome how the extension works is the manifest.

-   In this `frontend` directory, find the file named `metadata.json`.
-   **Rename it to `manifest.json`**.

This is a required step because Chrome specifically looks for a file with that exact name.

### Step 2: Load the Extension in Chrome

1.  Open Google Chrome.
2.  Navigate to the extensions page by typing `chrome://extensions` in your address bar and pressing Enter.
3.  In the top-right corner of the page, toggle the **"Developer mode"** switch to the ON position.
4.  Three new buttons will appear: "Load unpacked", "Pack extension...", and "Update". Click on **"Load unpacked"**.
5.  A file selection dialog will open. Navigate to this `frontend` directory on your computer and select it.
6.  Click "Select Folder".

The "YouTube Downloader" extension should now appear in your list of extensions, and its icon will be added to your Chrome toolbar.

## How to Use

1.  Make sure your local backend server is running (see `server/README.md`).
2.  Navigate to any video page on YouTube (e.g., `https://www.youtube.com/watch?v=...`).
3.  Click on the YouTube Downloader icon in your Chrome toolbar.
4.  A small popup will appear. Click the "Download Video" button.
5.  The request will be sent to your server, and the video will begin downloading to your computer's `Downloads` folder. The popup will show a success message and then close automatically.
