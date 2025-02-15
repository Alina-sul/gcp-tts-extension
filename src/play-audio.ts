// Called once the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Retrieve the base64 audio string from local storage
  chrome.storage.local.get('ttsAudio', (data: { ttsAudio?: string }) => {
    if (data.ttsAudio) {
      playBase64Audio(data.ttsAudio);
      // Optionally remove it from storage after playing
      chrome.storage.local.remove('ttsAudio');
    } else {
      console.error('No TTS audio found in storage.');
    }
  });
});

/**
 * Converts a base64-encoded MP3 string into playable audio and plays it.
 *
 * @param base64Data - The base64-encoded MP3 data returned from TTS.
 */
function playBase64Audio(base64Data: string): void {
  try {
    // Decode base64 into a string of binary data
    const binaryString = window.atob(base64Data);

    // Convert binary string to a typed array
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Create a Blob from the typed array
    const blob = new Blob([bytes], { type: 'audio/mp3' });
    const blobUrl = URL.createObjectURL(blob);

    // Create an Audio element, set its source, and play
    const audio = new Audio(blobUrl);
    audio.play().catch((err) => {
      console.error('Audio playback failed:', err);
    });
  } catch (error) {
    console.error('Failed to process base64 audio:', error);
  }
}
