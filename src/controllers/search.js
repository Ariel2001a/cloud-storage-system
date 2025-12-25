const { fileSocket } = require('../FileSocketClient');
const filesModel = require('../models/files');
const User = require('../models/users')

exports.getFilesByQuery = async(req, res) => {
    const userId = req.headers['user-id'];

    const user= User.getUserById(parseInt(userId))

    if (!userId) {
        return res.status(401).json({error:'User not logged in'});
    }
    
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    const query = req.params.query
    const cppResponse = await fileSocket.sendCommand(
            `SEARCH ${query}`
    );


    const lines = cppResponse ? cppResponse.split(/\r?\n/).filter(l => l.trim() !== '') : [];
    console.log (cppResponse)
    const filesLine = lines.slice(1).join(' ');

    console.log(filesLine)
    const filesListFromTCP = filesLine.split(' ').map(f => f.trim()).filter(f => f);
    
    const userFiles = filesModel.getUserFiles(userId);

    const filesList =[];

    filesListFromTCP.forEach(file_id => {
        const idNum = parseInt(file_id);
        const file = filesModel.getFileById(userId,idNum);
        if (file) {
            filesList.push(file);
        }
    });

    userFiles.forEach(item => {

        if (!filesList.some(f => f.id === item.id) && item.name.includes(query)) {
            filesList.push(item);
        }
        
    });

    return res.status(200).json({ filesList });
};