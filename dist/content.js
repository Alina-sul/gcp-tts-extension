"use strict";
console.log("Cloud Speak is loaded!");
document.addEventListener('mouseup', () => {
    const selection = window.getSelection();
    if (selection) {
        const selectedText = selection.toString().trim();
        if (selectedText) {
            console.log('Selected text:', selectedText);
        }
    }
});
