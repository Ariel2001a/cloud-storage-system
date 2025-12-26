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

exports.patchFileById = async(req,res) =>{
    const userId = req.headers['user-id'];

    const user= User.getUserById(parseInt(userId))

    if (!userId) {
        return res.status(401).json({error:'User not logged in'});
    }
    
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    let update = false
    const file = filesModel.getFileById(userId,parseInt(req.params.id))
    if (!file)
        return res.status (404).json({ error: 'File not found' })
    const {name, content} = req.body
    if(name != null){
        file.name = name
        update = true
    }

    if(content!=null){
        file.content = content
        if (file.type === 'file'){
            try{
                const cppResponseDelete = await fileSocket.sendCommand(
                    `DELETE ${file.id}`
                );
                
                if (cppResponseDelete.includes("400")){
                    return res.status(400).json({error:'Delete'});
                }
                if (cppResponseDelete.includes("500")) {
                    return res.status(500).json({error:'Delete'});
                }
                
                const cppResponsePost = await fileSocket.sendCommand(
                    `POST ${file.id} ${content || ''}`
                );

                if (cppResponsePost.includes("400")){
                    return res.status(400).json({error:'Post'});
                }
                if (cppResponsePost.includes("500")) {
                    return res.status(500).json({error:'Post'});
                }
            }catch(error){
                return res.status(500);
            }
        }
        update = true
    }

    if ('parentId' in req.body) {
        file.folderParent = req.body.parentId;
        update = true;
    }

    if(update)
        return res.status (204).end()

    return res.status (400).json({ error: 'fields to update are required' })
}

/* Deletes a file or folder by ID for a user */
exports.deleteFileById = async(req,res) => {
    const userId = req.headers['user-id'];

    const user= User.getUserById(parseInt(userId))

    if (!userId) {
        return res.status(401).json({error:'User not logged in'});
    }
    
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    const idToDelete = parseInt(req.params.id);
    const file = filesModel.getFileById(userId,idToDelete);
    if (!file) return res.status(404).json({ error: 'File not found' });

    if(file.type === 'folder')
    {
        const id_files_in_folder = filesModel.getFolderFiles(userId,idToDelete)
        for (const id of id_files_in_folder) {
            filesModel.deleteFileById(userId, id);
            try {
                const cppResponseDelete = await fileSocket.sendCommand(`DELETE ${id}`);

                if (cppResponseDelete.includes("400")) {
                    return res.status(400).json({ error: 'Delete' });
                }
                if (cppResponseDelete.includes("500")) {
                    return res.status(500).json({ error: 'Delete' });
                }
            } catch (error) {
                return res.status(500);
            }
        } 
    }

    filesModel.deleteFileById(userId,idToDelete);

    if (file.type === 'file'){
        try{
            const cppResponseDelete = await fileSocket.sendCommand(
                `DELETE ${idToDelete}`
            );

            console.log(cppResponseDelete)

            if (cppResponseDelete.includes("400")){
                return res.status(400).json({error:'Delete'});
            }
            if (cppResponseDelete.includes("500")) {
                return res.status(500).json({error:'Delete'});
            }
        }catch(error){
                return res.status(500);
            }
    }
    return res.status(204).end(); 
}
