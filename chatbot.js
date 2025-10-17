require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize the Google Generative AI with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function runChatbot() {
  try {
    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});

    // Start a chat session
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

    // Example conversation
    const msg = "What are some ways to reduce plastic waste at home?";
    console.log("User: " + msg);
    
    const result = await chat.sendMessage(msg);
    const response = await result.response;
    const text = response.text();
    console.log("Bot: " + text);
    
    return text;
  } catch (error) {
    console.error("Error in chatbot:", error);
    return "Sorry, I encountered an error. Please try again later.";
  }
}

// For testing the chatbot directly
if (require.main === module) {
  runChatbot();
}

module.exports = { runChatbot };
