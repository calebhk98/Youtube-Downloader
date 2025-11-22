// Fix: Add type declaration for chrome extension APIs to resolve "Cannot find name 'chrome'".
declare const chrome: any;

document.addEventListener('DOMContentLoaded', () => {
  // Fix: Cast to HTMLButtonElement to access 'disabled' property and add null check.
  const downloadBtn = document.getElementById('downloadBtn') as HTMLButtonElement | null;
  const statusEl = document.getElementById('status');
  const progressContainer = document.getElementById('progress-container');
  const progressBar = document.getElementById('progress-bar');
  const infoEl = document.getElementById('info');
  
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;

  // Fix: Add null check for DOM elements.
  if (!downloadBtn || !statusEl || !progressContainer || !progressBar || !infoEl) {
    console.error('Required UI elements not found.');
    return;
  }

  // Check current tab and enable/disable button
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs: any[]) => {
    const currentTab = tabs[0];
    // Fix: Check if currentTab.url exists before testing.
    if (currentTab && currentTab.url && youtubeRegex.test(currentTab.url)) {
      downloadBtn.disabled = false;
      statusEl.textContent = 'Ready to download.';
    } else {
      downloadBtn.disabled = true;
      statusEl.textContent = 'This is not a YouTube video page.';
    }
  });

  downloadBtn.addEventListener('click', () => {
    // Reset UI for download
    downloadBtn.disabled = true;
    infoEl.classList.add('hidden'); // Hide original info text
    progressContainer.classList.remove('hidden'); // Show progress bar
    statusEl.textContent = 'Downloading... This may take a moment.';

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs: any[]) => {
      const url = tabs[0].url;

      fetch('http://localhost:4000/download-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url }),
      })
      .then(response => {
        if (!response.ok) {
          // Try to parse error from server, otherwise use status text
          return response.json().then(err => { throw new Error(err.error || response.statusText) });
        }
        return response.json();
      })
      .then(data => {
        statusEl.textContent = 'Success! Video saved to your Downloads folder.';
        if (progressBar) {
            progressBar.style.animation = 'none'; // Stop animation
            progressBar.style.backgroundColor = '#28a745'; // A solid success green
        }
        // Close popup after success
        setTimeout(() => window.close(), 3000);
      })
      .catch(error => {
        console.error('Error:', error);
        statusEl.textContent = `Error: ${error.message}. Is the server running?`;
        // Hide progress and re-enable button on failure
        progressContainer.classList.add('hidden');
        infoEl.classList.remove('hidden'); // Show original info text again
        downloadBtn.disabled = false;
      });
    });
  });
});