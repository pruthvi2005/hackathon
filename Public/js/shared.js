// Shared functionality for all pages

// Load the chatbot on all pages
function loadChatbot() {
    // Always load the chatbot
    const script = document.createElement('script');
    script.src = '/js/chatbot.js';
    script.defer = true;
    document.head.appendChild(script);
    
    // Add Material Icons if not already present
    if (!document.querySelector('link[href*="material-icons"]')) {
        const link = document.createElement('link');
        link.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
    }
}

// Initialize when the DOM is fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadChatbot);
} else {
    loadChatbot();
}
