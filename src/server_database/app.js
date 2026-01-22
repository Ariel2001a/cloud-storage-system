const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// Import the TCP file socket client
const { fileSocket } = require('./FileSocketClient.js');

// Import routes
const filesRouter = require('./routes/files.js');
const UserRoutes = require('./routes/users.js');
const searchRouter = require('./routes/search.js');
const permissionRoutes = require('./routes/permissions.js');

// ====== Connect to MongoDB ======
const mongoHost = process.env.MONGO_HOST;
const mongoPort = process.env.MONGO_PORT;
const mongoDB = process.env.MONGO_DB;

async function connectWithRetry() {
  try {
    await mongoose.connect(`mongodb://${mongoHost}:${mongoPort}/${mongoDB}`);
    console.log(`✅ Connected to MongoDB at ${mongoHost}:${mongoPort}/${mongoDB}`);
  } catch (err) {
    console.error('❌ MongoDB connection failed, retrying in 5s...', err);
    setTimeout(connectWithRetry, 5000);
  }
}

connectWithRetry();

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Register routes
app.use('/api/users', UserRoutes);
app.use('/api/files', filesRouter);
app.use('/api/search', searchRouter);
app.use('/api/files', permissionRoutes);

// Start the server
app.listen(8080, '0.0.0.0', () => {
    console.log('Server is running on http://localhost:8080');
});
