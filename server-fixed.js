import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the project root
app.use(express.static('.'));

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Chat history storage (in-memory, for production use a database)
const chatSessions = new Map();

// API endpoint for chat
app.post('/api/chat', async (req, res) => {
    try {
        const { message, sessionId = 'default' } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        console.log('Received chat message:', message);

        // Get or create chat session
        if (!chatSessions.has(sessionId)) {
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            const chat = model.startChat({
                history: [
                    {
                        role: "user",
                        parts: [{ text: "You are a helpful assistant for EcoLearn, an environmental education platform. Keep your responses concise, educational, and focused on environmental topics." }],
                    },
                    {
                        role: "model",
                        parts: [{ text: "Got it! I'm here to help with all things related to environmental education. What would you like to know?" }],
                    },
                ],
                generationConfig: {
                    maxOutputTokens: 1000,
                },
            });
            chatSessions.set(sessionId, chat);
        }

        const chat = chatSessions.get(sessionId);
        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        res.json({ response: text });
    } catch (error) {
        console.error('Error in chat endpoint:', error);
        res.status(500).json({ 
            error: 'An error occurred while processing your request',
            details: error.message 
        });
    }
});

// Serve the main index.html for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Access the application at http://localhost:${PORT}`);
    console.log(`Chatbot API available at http://localhost:${PORT}/api/chat`);
});
