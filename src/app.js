const express = require ('express')
var app = express()

app.use(express.json())

const UserRoutes = require('./routes/users');
app.use('/api/users', UserRoutes);

app.listen(8080)