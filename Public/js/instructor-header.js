// This script will be included in all instructor pages
// It adds the chatbot and any other shared functionality

document.addEventListener('DOMContentLoaded', function() {
    // Add chatbot container if it doesn't exist
    if (!document.getElementById('ecolearn-chatbot-container')) {
        const chatContainer = document.createElement('div');
        chatContainer.id = 'ecolearn-chatbot-container';
        document.body.appendChild(chatContainer);
    }
    
    // Load shared scripts
    const sharedScript = document.createElement('script');
    sharedScript.src = '/js/shared.js';
    document.head.appendChild(sharedScript);
});
