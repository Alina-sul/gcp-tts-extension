"use strict";
let lastSelectedText = "";
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "textSelected") {
        lastSelectedText = message.text;
        console.log("Text selected:", lastSelectedText);
        // // Optionally, send it to the backend
        // fetch("https://your-backend-url/text-to-speech", {
        //     method: "POST",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify({ text: lastSelectedText }),
        // })
        //     .then((response) => response.json())
        //     .then((data) => {
        //         console.log("Backend response:", data);
        //     });
    }
    if (message.action === "getLastSelectedText") {
        sendResponse({ text: lastSelectedText });
    }
});
