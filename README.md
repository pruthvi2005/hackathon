# EcoLearn - Gamified Environmental Education Platform

EcoLearn is an interactive environmental education platform designed for schools and colleges, making learning about sustainability fun and engaging through gamification.

## Features

- Interactive learning modules on environmental topics
- AI-powered chatbot for instant assistance
- Student and instructor dashboards
- Gamified learning experience with points and achievements
- Real-time progress tracking
- Responsive design for all devices

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npx http-server . -p 5173
   ```
   Or using the Node.js server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

## Project Structure

```
ecolearn/
├── public/           # Static files and assets
├── htmlFiles/        # HTML templates
│   ├── Instructor/   # Instructor views
│   └── Student/      # Student views
├── game/             # Game components
├── jsFiles/          # Client-side JavaScript
├── server-fixed.js   # Main server file
└── README.md         # This file
```

## Technologies Used

- Frontend: HTML5, CSS3, JavaScript, Tailwind CSS
- Backend: Node.js, Express
- AI: Google Gemini API
- Development: Vite, npm

## Getting Started for Development

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ecolearn.git
   cd ecolearn
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your API key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   PORT=3000
   ```

## Contributing

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  Made with ❤️ by Your Team
</div>