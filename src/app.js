const express = require('express');
const app = express();


const { fileSocket } = require('./FileSocketClient.js'); 


const filesRouter = require('./routes/files.js'); 
const UserRoutes = require('./routes/users.js');

app.use(express.json());


app.use('/api/users', UserRoutes);
app.use('/api/files', filesRouter);

app.listen(8080, () => {
    console.log('Server is running on http://localhost:8080');
});