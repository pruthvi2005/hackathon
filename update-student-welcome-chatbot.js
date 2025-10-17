const fs = require('fs');
const path = require('path');

// Directories to update
const directories = [
    path.join(__dirname, 'htmlFiles', 'Student'),
    path.join(__dirname, 'htmlFiles', 'Welcome')
];

// Chatbot script and styles to add
const chatbotScript = `
    <!-- Chatbot Integration -->
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <script src="/js/shared.js" defer></script>
    <style>
        /* Chatbot Styles */
        #ecolearn-chatbot-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 1000;
        }
        
        .chatbot-toggle {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background-color: #20df6c;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            border: none;
            outline: none;
            transition: all 0.3s ease;
        }
        
        .chatbot-toggle:hover {
            transform: scale(1.05);
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
        }
        
        .material-icons {
            font-size: 28px;
        }
    </style>`;

// Function to update HTML files in a directory
function updateFilesInDirectory(directory) {
    if (!fs.existsSync(directory)) {
        console.log(`Directory not found: ${directory}`);
        return;
    }

    const files = fs.readdirSync(directory);
    
    files.forEach(file => {
        const filePath = path.join(directory, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            // Recursively process subdirectories
            updateFilesInDirectory(filePath);
        } else if (file.endsWith('.html')) {
            updateFile(filePath);
        }
    });
}

// Function to update a single file
function updateFile(filePath) {
    try {
        // Read the file
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Check if already updated
        if (content.includes('ecolearn-chatbot-container')) {
            console.log(`Skipping ${filePath} - already updated`);
            return;
        }
        
        // Add chatbot script before </head>
        content = content.replace(
            '</head>',
            chatbotScript + '\n    </head>'
        );
        
        // Add chatbot container before </body>
        content = content.replace(
            '</body>',
            '        <!-- Chatbot Container -->\n        <div id="ecolearn-chatbot-container"></div>\n    </body>'
        );
        
        // Write the updated content back to the file
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${filePath}`);
        
    } catch (error) {
        console.error(`Error updating ${filePath}:`, error.message);
    }
}

// Update all files in the specified directories
console.log('Adding chatbot to student and welcome pages...');
directories.forEach(updateFilesInDirectory);
console.log('Update complete!');
