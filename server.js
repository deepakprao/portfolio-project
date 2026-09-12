const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

// Create server
const server = http.createServer((req, res) => {
    console.log(`${req.method} ${req.url}`);

    // ===== Serve Static Files =====
    if (req.method === 'GET') {
        let filePath = '';
        
        if (req.url === '/') {
            filePath = './public/index.html';
        } else if (req.url === '/style.css') {
            filePath = './public/style.css';
        } else if (req.url === '/script.js') {
            filePath = './public/script.js';
        } else {
            // 404 for unknown routes
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
            return;
        }

        // Read and serve file
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Server Error');
                return;
            }

            // Set content type
            const ext = path.extname(filePath);
            const contentType = {
                '.html': 'text/html',
                '.css': 'text/css',
                '.js': 'application/javascript'
            }[ext] || 'text/plain';

            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        });
    }

    // ===== Handle Contact Form Submission =====
    else if (req.method === 'POST' && req.url === '/api/contact') {
        let body = '';

        // Collect data chunks
        req.on('data', chunk => {
            body += chunk.toString();
        });

        // When data is complete
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                console.log('📩 New message received:', data);

                // Validate data
                if (!data.name || !data.email || !data.message) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ 
                        success: false, 
                        error: 'All fields are required' 
                    }));
                    return;
                }

                // Read existing messages
                fs.readFile('./data/messages.json', 'utf8', (err, fileData) => {
                    let messages = [];
                    
                    if (!err && fileData) {
                        try {
                            messages = JSON.parse(fileData);
                        } catch (e) {
                            messages = [];
                        }
                    }

                    // Add new message
                    const newMessage = {
                        id: messages.length + 1,
                        name: data.name,
                        email: data.email,
                        message: data.message,
                        timestamp: new Date().toISOString()
                    };

                    messages.push(newMessage);

                    // Save to file
                    fs.writeFile(
                        './data/messages.json', 
                        JSON.stringify(messages, null, 2),
                        (err) => {
                            if (err) {
                                res.writeHead(500, { 'Content-Type': 'application/json' });
                                res.end(JSON.stringify({ 
                                    success: false, 
                                    error: 'Failed to save message' 
                                }));
                                return;
                            }

                            console.log('✅ Message saved!');
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ 
                                success: true, 
                                message: 'Thank you! Your message has been received.',
                                data: newMessage
                            }));
                        }
                    );
                });
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 
                    success: false, 
                    error: 'Invalid data format' 
                }));
            }
        });
    }

    // ===== Get All Messages (for admin view) =====
    else if (req.method === 'GET' && req.url === '/api/messages') {
        fs.readFile('./data/messages.json', 'utf8', (err, data) => {
            if (err) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify([]));
                return;
            }

            try {
                const messages = JSON.parse(data);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(messages));
            } catch (e) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify([]));
            }
        });
    }

    // ===== 404 for other methods =====
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
    }
});

// Start server
server.listen(PORT, () => {
    console.log('🚀 Portfolio server running!');
    console.log(`📱 Open: http://localhost:${PORT}`);
    console.log(`📩 Contact API: http://localhost:${PORT}/api/contact`);
    console.log(`📋 Messages: http://localhost:${PORT}/api/messages`);
});