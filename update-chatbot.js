const fs = require('fs');
const path = require('path');

// Directory containing instructor HTML files
const instructorDir = path.join(__dirname, 'htmlFiles', 'Instructor');

// Files to update
const filesToUpdate = [
    'EduDash.html',
    'EduMyClasses.html',
    'StuTracking.html',
    'content-management.html',
    'educlassManage.html',
    'edunotif.html'
];

// Chatbot script and styles to add
const chatbotScript = `
    <!-- Chatbot Integration -->
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <script src="/js/instructor-header.js" defer></script>
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

// Function to update a single file
function updateFile(fileName) {
    const filePath = path.join(instructorDir, fileName);
    
    try {
        // Read the file
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Check if already updated
        if (content.includes('ecolearn-chatbot-container')) {
            console.log(`Skipping ${fileName} - already updated`);
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
        console.log(`Updated ${fileName}`);
        
    } catch (error) {
        console.error(`Error updating ${fileName}:`, error.message);
    }
}

// Update all files
console.log('Updating instructor pages with chatbot integration...');
filesToUpdate.forEach(updateFile);
console.log('Update complete!');
