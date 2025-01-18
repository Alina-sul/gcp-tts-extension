let previousSelectedText = ""; // Store the previously selected text

document.addEventListener("mouseup", () => {
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
        const existingIcon = document.getElementById("selection-icon");
        if (existingIcon) {
            existingIcon.remove();
        }

        if (selectedText) {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();

            // Create the icon element
            const icon = document.createElement("img");
            icon.src = chrome.runtime.getURL("/images/selection-icon.svg");
            icon.id = "selection-icon";
            icon.style.position = "absolute";
            icon.style.cursor = "pointer";
            icon.style.width = "24px";
            icon.style.height = "24px";
            icon.style.top = `${window.scrollY + rect.top - 30}px`;
            icon.style.left = `${window.scrollX + rect.left}px`;
            icon.style.pointerEvents = "auto"; // Ensure icon can receive clicks

            // Add click event to the icon
            icon.addEventListener("click", () => {
                console.log(`You selected: ${selectedText}`);
            });

            // Append the icon to the body
            document.body.appendChild(icon);
        }
    }
});

// Remove the icon when clicking elsewhere
document.addEventListener("mousedown", (e) => {
    const icon = document.getElementById("selection-icon");
    if (icon && e.target !== icon) {
        icon.remove();
        previousSelectedText = ""; // Reset the previous selection when clicking outside
    }
});
