class EcoLearnChatbot {
    constructor() {
        this.isOpen = false;
        this.chatHistory = [];
        this.chatSession = Date.now().toString(); // Unique session ID
        this.initializeChatbot();
    }

    async initializeChatbot() {
        // Create chatbot container
        this.createChatbotUI();
        
        // Add event listeners
        this.setupEventListeners();
        
        // Initial greeting
        this.addBotMessage("Hello! I'm your EcoLearn assistant. How can I help you with environmental education today?");
    }

    createChatbotUI() {
        // Create main container
        this.chatbotContainer = document.createElement('div');
        this.chatbotContainer.className = 'fixed bottom-6 right-6 w-80 bg-white rounded-t-xl shadow-xl flex flex-col z-50';
        this.chatbotContainer.style.height = '500px';
        this.chatbotContainer.style.display = 'none';
        
        // Chat header
        const header = document.createElement('div');
        header.className = 'bg-green-600 text-white p-3 rounded-t-xl flex justify-between items-center';
        header.innerHTML = `
            <div class="flex items-center">
                <img src="/Images/gamification (2).png" alt="EcoLearn" class="w-8 h-8 mr-2">
                <h3 class="font-semibold">EcoLearn Assistant</h3>
            </div>
            <button id="minimizeChat" class="text-white hover:text-gray-200">
                <span class="material-icons">minimize</span>
            </button>
        `;
        
        // Chat messages container
        this.messagesContainer = document.createElement('div');
        this.messagesContainer.className = 'flex-1 p-4 overflow-y-auto bg-gray-50';
        
        // Chat input area
        const inputArea = document.createElement('div');
        inputArea.className = 'p-3 border-t border-gray-200 bg-white';
        inputArea.innerHTML = `
            <div class="flex items-center">
                <input type="text" id="chatInput" 
                       class="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-500" 
                       placeholder="Type your message...">
                <button id="sendMessage" 
                        class="bg-green-600 text-white p-2 rounded-r-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
                    <span class="material-icons">send</span>
                </button>
            </div>
        `;
        
        // Chat toggle button
        this.toggleButton = document.createElement('button');
        this.toggleButton.className = 'fixed bottom-6 right-6 bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 focus:outline-none';
        this.toggleButton.innerHTML = '<span class="material-icons">chat</span>';
        
        // Assemble the chatbot
        this.chatbotContainer.appendChild(header);
        this.chatbotContainer.appendChild(this.messagesContainer);
        this.chatbotContainer.appendChild(inputArea);
        
        // Add to body
        document.body.appendChild(this.chatbotContainer);
        document.body.appendChild(this.toggleButton);
        
        // Store references to elements
        this.chatInput = this.chatbotContainer.querySelector('#chatInput');
        this.sendButton = this.chatbotContainer.querySelector('#sendMessage');
        this.minimizeButton = this.chatbotContainer.querySelector('#minimizeChat');
    }

    setupEventListeners() {
        // Toggle chat
        this.toggleButton.addEventListener('click', () => this.toggleChat());
        this.minimizeButton.addEventListener('click', () => this.toggleChat());
        
        // Send message on button click
        this.sendButton.addEventListener('click', () => this.handleUserMessage());
        
        // Send message on Enter key
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.handleUserMessage();
            }
        });
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
            this.chatbotContainer.style.display = 'flex';
            this.chatbotContainer.style.flexDirection = 'column';
            this.toggleButton.style.display = 'none';
            this.chatInput.focus();
        } else {
            this.chatbotContainer.style.display = 'none';
            this.toggleButton.style.display = 'block';
        }
    }

    async handleUserMessage() {
        const message = this.chatInput.value.trim();
        if (!message) return;
        
        // Add user message to chat
        this.addUserMessage(message);
        this.chatInput.value = '';
        
        // Show typing indicator
        const typingIndicator = this.addTypingIndicator();
        
        try {
            // Call your backend API
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    message,
                    sessionId: this.chatSession 
                }),
            });
            
            const data = await response.json();
            
            // Remove typing indicator
            typingIndicator.remove();
            
            if (data.response) {
                this.addBotMessage(data.response);
            } else {
                this.addBotMessage("I'm sorry, I couldn't process your request. Please try again later.");
            }
        } catch (error) {
            console.error('Error:', error);
            typingIndicator.remove();
            this.addBotMessage("I'm having trouble connecting to the server. Please check your connection and try again.");
        }
    }

    addUserMessage(message) {
        this.chatHistory.push({ role: 'user', content: message });
        const messageDiv = document.createElement('div');
        messageDiv.className = 'mb-4 flex justify-end';
        messageDiv.innerHTML = `
            <div class="bg-green-100 text-gray-800 p-3 rounded-lg max-w-[80%]">
                <p>${this.escapeHtml(message)}</p>
            </div>
        `;
        this.messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }

    addBotMessage(message) {
        this.chatHistory.push({ role: 'assistant', content: message });
        const messageDiv = document.createElement('div');
        messageDiv.className = 'mb-4 flex';
        messageDiv.innerHTML = `
            <div class="bg-white border border-gray-200 p-3 rounded-lg max-w-[80%]">
                <p>${this.escapeHtml(message)}</p>
            </div>
        `;
        this.messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }

    addTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'mb-4 flex';
        typingDiv.id = 'typingIndicator';
        typingDiv.innerHTML = `
            <div class="bg-white border border-gray-200 p-3 rounded-lg">
                <div class="flex space-x-1">
                    <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                    <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                    <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.3s"></div>
                </div>
            </div>
        `;
        this.messagesContainer.appendChild(typingDiv);
        this.scrollToBottom();
        return typingDiv;
    }

    scrollToBottom() {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}

// Initialize chatbot when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize if we're on an instructor page
    if (window.location.pathname.includes('/Instructor/')) {
        window.ecolearnChatbot = new EcoLearnChatbot();
    }
});
