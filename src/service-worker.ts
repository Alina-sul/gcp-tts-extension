import MessageSenderWorker = chrome.runtime.MessageSender;

chrome.action.onClicked.addListener(async (tab) => {
  // Check if the token exists in storage
  chrome.storage.local.get('apiKey', (data) => {
    if (!data.apiKey) {
      console.log('No token found, opening popup...');
      chrome.windows.create({
        url: 'popup.html',
        type: 'popup',
        width: 300,
        height: 200,
      });
    } else {
      console.log('Token found:', data.authToken);
      chrome.tabs.sendMessage(tab.id!, { action: 'tokenExists', token: data.authToken });
    }
  });
});

chrome.runtime.onMessage.addListener(
  async (message: any, sender: MessageSenderWorker, sendResponse: (response?: any) => void) => {
    if (message.type === 'SEND_TO_TTS') {
      console.log('Received text for TTS:', message.text);

      // Retrieve the API key from Chrome storage
      chrome.storage.local.get(['apiKey'], async (result) => {
        const apiKey = result.apiKey;
        if (!apiKey) {
          console.error('No API key found in storage.');
          return;
        }

        // Prepare the request payload
        const requestBody = {
          input: { text: message.text },
          voice: { languageCode: 'en-US', ssmlGender: 'MALE' },
          audioConfig: { audioEncoding: 'MP3' },
        };

        try {
          // Call Google Cloud Text-to-Speech API
          const response = await fetch(
            `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(requestBody),
            },
          );

          const data = await response.json();

          if (data.audioContent) {
            // Convert base64 audio to a playable format
            const audioUrl = 'data:audio/mp3;base64,' + data.audioContent;
            console.error('AudioUrl:', audioUrl);

            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
              if (tabs[0]?.id) {
                chrome.tabs.sendMessage(tabs[0].id, {
                  type: 'PLAY_AUDIO',
                  audioUrl: 'data:audio/mp3;base64,' + data.audioContent,
                });
              }
            });
          } else {
            console.error('Error in response:', JSON.stringify(data, null, 2));
          }
        } catch (error) {
          console.error('Error:', error);
        }
      });

      return true; // Keeps the sendResponse function alive for async use
    }
  },
);
