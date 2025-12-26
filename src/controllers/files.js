const { fileSocket } = require('../FileSocketClient'); // import socket client to communicate with C++ server
const filesModel = require('../models/files');         // import files model to store/retrieve files
const User = require('../models/users')               // import user model

let filesCounter = 0; // global counter for file/folder IDs


let filesCounter = 0;
// Create a new file or folder
const createFileOrFolder = async (req, res) => {
    const userId = req.headers['user-id'];          // get user ID from headers
    const { name, type, content, parentId } = req.body; // get data from request body
    const user= User.getUserById(parseInt(userId)) // find user by ID

    if (!userId) {                                  // check if user ID is missing
        return res.status(401).json({error:'User not logged in'});
    }
    
    if (!user) {                                    // check if user exists
        return res.status(404).json({ error: "User not found" });
    }

    if (!name || !type) {                           // validate required fields
        return res.status(400).json({ error: "Missing Fields" });
    }

    try {
        if (type === 'file') {                      // handle file creation
            const cppResponse = await fileSocket.sendCommand(
                `POST ${++filesCounter} ${content || ''}` // send file content to C++ server
            );

            if (cppResponse.includes("400")){       // handle bad request from server
                return res.status(400);
            }
            if (cppResponse.includes("500")) {     // handle server error
                return res.status(500);
            }

            filesModel.addFileOrFolder(userId, {   // save file in model
                id: filesCounter,
                name,
                type,
                date: Date.now(),
                folderParent: parentId || null
            });

            return res.status(201).location(`/api/files/${filesCounter}`).json({ id: filesCounter }); // respond with new file ID
        }

        if (type === 'folder') {                    // handle folder creation
            filesModel.addFileOrFolder(userId, {   // save folder in model
                id: ++filesCounter,
                name,
                type,
                date: Date.now(),
                folderParent: parentId || null
            });

            return res.status(201).location(`/api/files/${filesCounter}`).json({ id: filesCounter }); // respond with new folder ID
        }

        return res.status(400).json({ error: 'Invalid type' }); // invalid type provided

    } catch (error) {                               // catch unexpected errors
        return res.status(500);
    }
};


// Get top-level files for a user
const getFiles = (req, res) => {
    const userId = req.headers['user-id'];          // get user ID from headers
    const user= User.getUserById(parseInt(userId)) // find user by ID

    if (!userId) {                                  // check if user ID is missing
        return res.status(401).json({error:'User not logged in'});
    }
    
    if (!user) {                                    // check if user exists
        return res.status(404).json({ error: "User not found" });
    }

    const files = filesModel.getTopLevelFiles(userId); // get top-level files
    res.json({ files });                             // return files as JSON
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

module.exports = {
    createFileOrFolder, // export create function
    getFiles           // export get function
};
