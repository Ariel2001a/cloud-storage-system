    const File = require ('../services/files');
    const User = require('../services/users');
    const { fileSocket } = require('../../src/FileSocketClient');


const getFilesByQuery = async (userId, query) => { 
    
    // Send SEARCH command to the TCP server
    const cppResponse = await fileSocket.sendCommand(
        `SEARCH ${query}`
    );

    // Parse TCP server response
    const lines = cppResponse ? cppResponse.split(/\r?\n/).filter(l => l.trim() !== '') : [];
    const filesLine = lines.slice(1).join(' ');
    const filesListFromTCP = filesLine.split(' ').map(f => f.trim()).filter(f => f);

    const tcpIds = filesListFromTCP.map(id => parseInt(id));
    const filesList = await File.find({ ownerId: userId, id: { $in: tcpIds } });

    // Add local files that match the query but are not in TCP results
    const newFiles = await File.find({
        ownerId: userId,
        name: { $regex: query, $options: 'i' },
        id: { $nin: filesList.map(f => f.id) }
    });

    const combinedFiles = [...filesList, ...newFiles];

    return combinedFiles;
};