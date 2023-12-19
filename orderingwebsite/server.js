const express = require('express');
const path = require('path');

const app = express();
const port = 5000; // You can use any available port

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running at http://0.0.0.0:${port}/`);
});