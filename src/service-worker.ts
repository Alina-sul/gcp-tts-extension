chrome.action.onClicked.addListener(async (tab) => {
    // Check if the token exists in storage
    chrome.storage.local.get("apiKey", (data) => {
        if (!data.apiKey) {
            console.log("No token found, opening popup...");
            chrome.windows.create({
                url: "popup.html",
                type: "popup",
                width: 300,
                height: 200
            });
        } else {
            console.log("Token found:", data.authToken);
            // You can send a message to content.ts if needed
            chrome.tabs.sendMessage(tab.id!, { action: "tokenExists", token: data.authToken });
        }
    });
});
