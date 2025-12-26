const express = require('express');
const app = express();

// Import the TCP file socket client
const { fileSocket } = require('./FileSocketClient.js'); 

// Import routes
const filesRouter = require('./routes/files.js'); 
const UserRoutes = require('./routes/users.js');
const searchRouter = require('./routes/search.js');
const permissionRoutes=require('./routes/permissions.js');

// Enable JSON parsing for incoming requests
app.use(express.json());

// Register routes
app.use('/api/users', UserRoutes);  // Users endpoints
app.use('/api/files', filesRouter); // Files endpoints
app.use('/api/search', searchRouter);  // Search endpoints
app.use('/api/files', permissionRoutes);


 // Start the server
app.listen(8080,'0.0.0.0',()=> {
    console.log('Server is running on http://localhost:8080');
});