"use strict";
// popup.ts
const displayText = (text) => {
    const displayElement = document.getElementById("selectedText");
    if (displayElement) {
        displayElement.textContent = text;
    }
};
document.addEventListener("DOMContentLoaded", () => {
    chrome.runtime.sendMessage({ action: "getLastSelectedText" }, (response) => {
        if (response && response.text) {
            displayText(response.text);
        }
    });
});
document.addEventListener("mouseup", () => {
    const selectedText = window.getSelection()?.toString()?.trim();
    console.log("Selected text:", selectedText); // Log selected text
    if (selectedText) {
        chrome.runtime.sendMessage({ action: "textSelected", text: selectedText });
    }
});
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Message received in background:", message);
    if (message.action === "textSelected") {
        console.log("Text selected:", message.text);
    }
});
