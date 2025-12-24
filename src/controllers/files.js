const { fileSocket } = require('../FileSocketClient');
const filesModel = require('../models/files');
const User = require('../models/users')


let filesCounter = 0;

exports.createFileOrFolder = async (req, res) => {
    const userId = req.headers['user-id'];
    const { name, type, content, parentId } = req.body;
    const user= User.getUserById(parseInt(userId))

    if (!userId) {
        return res.status(401).json({error:'User not logged in'});
    }
    
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    if (!name || !type) {
        return res.status(400).json({ error: "Missing Fields" });
    }

    try {
        if (type === 'file') {
            const cppResponse = await fileSocket.sendCommand(
                `POST ${++filesCounter} ${content || ''}`
            );

            if (cppResponse.includes("400")){
                return res.status(400);
            }
            if (cppResponse.includes("500")) {
                return res.status(500);
            }

            filesModel.addFileOrFolder(userId, {
                id: filesCounter,
                name,
                type,
                date: Date.now(),
                folderParent: parentId || null
            });

            return res.status(201).location(`/api/files/${filesCounter}`).json({ id: filesCounter });
        }

        if (type === 'folder') {
            filesModel.addFileOrFolder(userId, {
                id: ++filesCounter,
                name,
                type,
                date: Date.now(),
                folderParent: parentId || null
            });

            return res.status(201).location(`/api/files/${filesCounter}`).json({ id: filesCounter });
        }

        return res.status(400).json({ error: 'Invalid type' });

    } catch (error) {
        return res.status(500);
    }
};

exports.getFiles = (req, res) => {
    const userId = req.headers['user-id'];

    const user= User.getUserById(parseInt(userId))

    if (!userId) {
        return res.status(401).json({error:'User not logged in'});
    }
    
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    const files = filesModel.getTopLevelFiles(userId);
    res.json({ files });
};

exports.getFileById = (req, res) => {
    const userId = req.headers['user-id'];

    const user= User.getUserById(parseInt(userId))

    if (!userId) {
        return res.status(401).json({error:'User not logged in'});
    }
    
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    const file = filesModel.getFileById(userId,parseInt(req.params.id))
    if (!file)
    return res.status (404).json({ error: 'File not found' })
    res.json({file})
}