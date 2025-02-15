import MessageSenderContent = chrome.runtime.MessageSender;

let previousSelectedText = ''; // Store the previously selected text

// Create and attach icon to client
document.addEventListener('mouseup', () => {
  const selection = window.getSelection();
  if (selection) {
    const selectedText = selection.toString().trim();

    // If the selection hasn't changed, do nothing
    if (selectedText === previousSelectedText) {
      return;
    }

    // Update the previousSelectedText
    previousSelectedText = selectedText;

    // Remove any existing icon
    const existingIcon = document.getElementById('selection-icon');
    if (existingIcon) {
      existingIcon.remove();
    }

    if (selectedText) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      // Create the icon element
      const icon = document.createElement('img');
      icon.src = chrome.runtime.getURL('/images/selection-icon.svg');
      icon.id = 'selection-icon';
      icon.style.position = 'absolute';
      icon.style.cursor = 'pointer';
      icon.style.width = '24px';
      icon.style.height = '24px';
      icon.style.top = `${window.scrollY + rect.top - 30}px`;
      icon.style.left = `${window.scrollX + rect.left}px`;
      icon.style.pointerEvents = 'auto'; // Ensure icon can receive clicks

      // Add click event to the icon
      icon.addEventListener('click', async () => {
        let apiKey = await getApiKey();
        if (!apiKey) {
          // Prompt user to add the API key
          apiKey = prompt('API key is missing. Please enter your Google Cloud service API key:');
          if (apiKey) {
            await saveApiKey(apiKey.trim());
          } else {
            alert('API key is required to use this feature.');
            return;
          }
        }

        // Send the selected text and API key to the service worker
        await chrome.runtime.sendMessage({ type: 'SEND_TO_TTS', text: selectedText });
      });

      // Append the icon to the body
      document.body.appendChild(icon);
    }
  }
});

// Remove the icon when clicking elsewhere
document.addEventListener('mousedown', (e) => {
  const icon = document.getElementById('selection-icon');
  if (icon && e.target !== icon) {
    icon.remove();
    previousSelectedText = ''; // Reset the previous selection when clicking outside
  }
});

// Helper function to get the API key from storage
// @ts-ignore
function getApiKey(): Promise<string | null> {
  return new Promise((resolve) => {
    chrome.storage.local.get('apiKey', (data) => {
      resolve(data.apiKey || null);
    });
  });
}

// Helper function to save the API key to storage
async function saveApiKey(apiKey: string): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.local.set({ apiKey }, () => {
      console.log('API key saved!');
      alert('API key saved successfully.');
      resolve();
    });
  });
}

// // Play audio
// chrome.runtime.onMessage.addListener(
//   async (message: any, sender: MessageSenderContent, sendResponse: (response?: any) => void) => {
//     if (message.type === 'PLAY_AUDIO') {
//       console.log('Playing audio...');
//       const audio = new Audio(message.audioUrl);
//       await audio.play();
//     }
//   },
// );

chrome.runtime.onMessage.addListener(
  async (message: any, sender: MessageSenderContent, sendResponse: (response?: any) => void) => {
    if (message.type === 'PLAY_AUDIO') {
      console.log('Received audio in content script. Converting base64 to blob...');
      try {
        const bytes = new Uint8Array(
          atob(message.audioContent)
            .split('')
            .map((char) => char.charCodeAt(0)),
        );
        const blob = new Blob([bytes], { type: 'audio/mp3' });
        const blobUrl = URL.createObjectURL(blob);

        const audio = new Audio(blobUrl);
        await audio.play();
        console.log('Playback started with a Blob URL.');
      } catch (error) {
        console.error('Error playing audio:', error);
      }
    }
  },
);
