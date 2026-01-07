const { fileSocket } = require('../FileSocketClient'); // import socket client to communicate with C++ server
const filesModel = require('../models/files');         // import files model to store/retrieve files
const User = require('../models/users');               // import user model

const { addPermission } = require('../models/permissions');
const { PERMISSION_TYPES } = require('../models/permissions');

let filesCounter = 0;

// Creates a file or folder for the user
exports.createFileOrFolder = async (req, res) => {
    const userId = req.headers['user-id'];              // get user ID from headers
    const { name, type, content, parentId } = req.body; // get data from request body
    const user = User.getUserById(parseInt(userId));    // find user by ID

    if (!userId) {                                      // check if user ID is missing
        return res.status(401).json({ error: 'User not logged in' });
    }

    if (!user) {                                        // check if user exists
        return res.status(404).json({ error: "User not found" });
    }

    if (parentId != null) {
        const parent = filesModel.getFileById(userId, parentId);
        if (!parent || parent.type !== 'folder') {
            return res.status(400).json({ error: "Folder Parent does not exist" });
        }
    }

    if (!name || !type) {
        return res.status(400).json({ error: "Missing Fields" });
    }

    try {
        if (type === 'file') {                      // handle file creation
            const cppResponse = await fileSocket.sendCommand(
                `POST ${++filesCounter} ${content || ''}` // send file content to C++ server
            );

            if (cppResponse.includes("400")) {       // handle bad request from server
                return res.status(400).end();
            }
            if (cppResponse.includes("500")) {      // handle server error
                return res.status(500).end();
            }

            filesModel.addFileOrFolder(userId, {    // save file in model
                id: filesCounter,
                name,
                type,
                date: Date.now(),
                folderParent: parentId || null,
                starred: false
            });

            const perms = PERMISSION_TYPES[type];
            perms.forEach(p => {
                addPermission({
                    userId: parseInt(userId),
                    fileId: filesCounter,
                    permission: p,
                    type
                });
            });

            return res.status(201).location(`/api/files/${filesCounter}`).json({ id: filesCounter });
        }

        if (type === 'folder') {                    // handle folder creation
            if (content) {                         // folders should not have content
                return res.status(400).json({ error: 'Folders cannot have content' });
            }
            filesModel.addFileOrFolder(userId, {    // save folder in model
                id: ++filesCounter,
                name,
                type,
                date: Date.now(),
                folderParent: parentId || null
            });

            const perms = PERMISSION_TYPES[type];
            perms.forEach(p => {
                addPermission({
                    userId: parseInt(userId),
                    fileId: filesCounter,
                    permission: p,
                    type
                });
            });

            return res.status(201).location(`/api/files/${filesCounter}`).json({ id: filesCounter });
        }

        return res.status(400).json({ error: 'Invalid type' }); // invalid type provided

    } catch (error) {                               // catch unexpected errors
        return res.status(500).end();
    }
};

// Returns user's top-level files
exports.getFiles = (req, res) => {
    const userId = req.headers['user-id'];           // get user ID from headers
    const user = User.getUserById(parseInt(userId)); // find user by ID

    if (!userId) {                                   // check if user ID is missing
        return res.status(401).json({ error: 'User not logged in' });
    }

    if (!user) {                                     // check if user exists
        return res.status(404).json({ error: "User not found" });
    }

    const files = filesModel.getTopLevelFiles(userId); // get top-level files
    res.json({ files });                               // return files as JSON
};

exports.getDeletedFiles = (req, res) => {
    const userId = req.headers['user-id'];
    const user = User.getUserById(parseInt(userId));

    if (!userId) {
        return res.status(401).json({ error: 'User not logged in' });
    }

    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    const files = filesModel.getUserDeletedFiles(userId);
    res.json({ files });
};


exports.getSharedFiles = (req, res) => {
    const userId = req.headers['user-id'];
    const user = User.getUserById(parseInt(userId));

    if (!userId) {
        return res.status(401).json({ error: 'User not logged in' });
    }

    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    const files = filesModel.getUserSharedFiles(userId);
    res.json({ files });
};


// Returns file or folder by ID
exports.getFileById = (req, res) => {
    const userId = req.headers['user-id'];
    const user = User.getUserById(parseInt(userId));

    if (!userId) {
        return res.status(401).json({ error: 'User not logged in' });
    }

    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    const file = filesModel.getFileById(userId, parseInt(req.params.id));
    if (!file) {
        return res.status(404).json({ error: 'File not found' });
    }
    res.json({ file });
};

// Updates file or folder fields
exports.patchFileById = async (req, res) => {
    const userId = req.headers['user-id'];
    const user = User.getUserById(parseInt(userId));

    if (!userId) {
        return res.status(401).json({ error: 'User not logged in' });
    }

    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    let updateContent = false;
    let updateName = false;
    let updateParentId = false;

    const file = filesModel.getFileById(userId, parseInt(req.params.id));
    if (!file) {
        return res.status(404).json({ error: 'File not found' });
    }

    const { name, content, parentId } = req.body;

    if (content !== undefined) {

        if (file.type === 'folder') {                         // folders should not have content
            return res.status(400).json({ error: 'Folders cannot have content' });
        }

        updateContent = true;
    }
    
    if (name !== undefined) {
        if (name.trim() === '') {
            return res.status(400).json({ error: 'Invalid file name' });
        }
        updateName = true;
    }

    if (parentId !== undefined) {
        const parent = filesModel.getFileById(userId, parentId);
        if (!parent || parent.type !== 'folder') {
            return res.status(400).json({ error: "Folder Parent does not exist" });
        }
        updateParentId = true;
    }


    if (updateName || updateContent || updateParentId) {
        if (updateName) file.name = name;
        if (updateParentId) file.folderParent = parentId;
        if (updateContent) {
            try {
                const cppResponseDelete = await fileSocket.sendCommand(`DELETE ${file.id}`);

                if (cppResponseDelete.includes("400")) {
                    return res.status(400).json({ error: 'Delete' });
                }
                if (cppResponseDelete.includes("500")) {
                    return res.status(500).json({ error: 'Delete' });
                }

                const cppResponsePost = await fileSocket.sendCommand(
                    `POST ${file.id} ${content || ''}`
                );

                if (cppResponsePost.includes("400")) {
                    return res.status(400).json({ error: 'Post' });
                }
                if (cppResponsePost.includes("500")) {
                    return res.status(500).json({ error: 'Post' });
                }
            } catch (error) {
                return res.status(500).end();
            }
            
            file.content = content;
        }
        return res.status(204).end();
    }

    return res.status(400).json({ error: 'fields to update are required' });
};

// Deletes file or folder by ID
exports.deleteFileById = async (req, res) => {
    const userId = req.headers['user-id'];
    const user = User.getUserById(parseInt(userId));

    if (!userId) {
        return res.status(401).json({ error: 'User not logged in' });
    }

    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    const idToDelete = parseInt(req.params.id);
    let file = filesModel.getFileById(userId, idToDelete);
    if (!file){
        file = filesModel.getFileByIdFromDeleted(userId, idToDelete);
        if (!file) {
            return res.status(404).json({ error: 'File not found' });
        } 

        if (file.type === 'folder') {
            const id_files_in_folder = filesModel.getFolderFiles(userId, idToDelete);
            for (const id of id_files_in_folder) {
                filesModel.deleteFileByIdFromBin(userId, id);
                try {
                    const cppResponseDelete = await fileSocket.sendCommand(`DELETE ${id}`);

                    if (cppResponseDelete.includes("400")) {
                        return res.status(400).json({ error: 'Delete' });
                    }
                    if (cppResponseDelete.includes("500")) {
                        return res.status(500).json({ error: 'Delete' });
                    }
                } catch (error) {
                    return res.status(500).end();
                }
            }
        }

        filesModel.deleteFileByIdFromBin(userId, idToDelete);

        if (file.type === 'file') {
            try {
                const cppResponseDelete = await fileSocket.sendCommand(`DELETE ${idToDelete}`);

                if (cppResponseDelete.includes("400")) {
                    return res.status(400).json({ error: 'Delete' });
                }
                if (cppResponseDelete.includes("500")) {
                    return res.status(500).json({ error: 'Delete' });
                }
            } catch (error) {
                return res.status(500).end();
            }
        }
    }
    else {
        filesModel.deleteFileByIdFromUserFiles(userId, idToDelete);
        if (file.type === 'file') {
            if (file.starred) {
                filesModel.starOrUnstarFile(userId, idToDelete);
            }
    }
    return res.status(204).end();
};

exports.starOrUnstarFile = (req, res) => {
    const userId = req.headers['user-id'];
    const user = User.getUserById(parseInt(userId));
    if (!userId) {
        return res.status(401).json({ error: 'User not logged in' });
    } 
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    const fileId = parseInt(req.params.id);
    const success = filesModel.starOrUnstarFile(userId, fileId);
    if (!success) {
        return res.status(404).json({ error: 'File not found' });
    }
    return res.status(204).end();
};