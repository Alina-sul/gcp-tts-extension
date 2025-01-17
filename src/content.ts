console.log("Cloud Speak is loaded!");

document.addEventListener('mouseup', () => {
    // Remove any existing icon to prevent duplication
    const existingIcon = document.getElementById('selection-icon');
    if (existingIcon) {
        existingIcon.remove();
    }

    const selection = window.getSelection();
    if (selection) {
        const selectedText = selection.toString().trim();
        if (selectedText) {
            // Get the range of the selected text
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();

            // Create the icon element
            const icon = document.createElement('img');
            icon.src = chrome.runtime.getURL('/images/selection-icon.svg');
            icon.id = 'selection-icon';
            icon.style.position = 'absolute';
            icon.style.cursor = 'pointer';
            icon.style.width = '24px'; // Set icon size
            icon.style.height = '24px';
            icon.style.top = `${window.scrollY + rect.top - 30}px`; // Position icon above the selection
            icon.style.left = `${window.scrollX + rect.left}px`;

            // Add click event to the icon
            icon.addEventListener('click', () => {
                console.log('Icon clicked! Selected text:', selectedText);
            });

            // Append the icon to the body
            document.body.appendChild(icon);
        }
    }
});

// Remove the icon when the user clicks anywhere else on the page
document.addEventListener('mousedown', (e) => {
    const icon = document.getElementById('selection-icon');
    if (icon && e.target instanceof Node && !icon.contains(e.target)) {
        icon.remove();
    }
});




