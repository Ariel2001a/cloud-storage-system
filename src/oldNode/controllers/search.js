const { fileSocket } = require('../FileSocketClient');
const filesModel = require('../models/files');
const User = require('../models/users')

// Fetches files matching the query from TCP server and local user files, returns combined list
exports.getFilesByQuery = async (req, res) => {
    const userId = req.userId;

    // Get the user object and validate login
    const user = User.getUserById(parseInt(userId))
    if (!userId) {
        return res.status(401).json({ error: 'User not logged in' });
    }

    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    const query = req.params.query

    if (!query || query.trim() === '') {
        return res.status(400).json({ error: 'Invalid search query' });
    }

    // Send SEARCH command to the TCP server
    const cppResponse = await fileSocket.sendCommand(
        `SEARCH ${query}`
    );

    // Parse TCP server response
    const lines = cppResponse ? cppResponse.split(/\r?\n/).filter(l => l.trim() !== '') : [];
    const filesLine = lines.slice(1).join(' ');
    const filesListFromTCP = filesLine.split(' ').map(f => f.trim()).filter(f => f);

    // Get local files for the user
    const userFiles = filesModel.getUserFiles(userId);

    const filesList = [];

    // Combine TCP server files with local files
    filesListFromTCP.forEach(file_id => {
        const idNum = parseInt(file_id);
        const file = filesModel.getFileById(userId, idNum);
        if (file) {
            filesList.push(file);
        }
    });

    // Add local files that match the query but are not in TCP results
    userFiles.forEach(item => {

        if (!filesList.some(f => f.id === item.id) && item.name.includes(query)) {
            filesList.push(item);
        }

    });

    // Return combined list of files
    return res.status(200).json({ filesList });
};