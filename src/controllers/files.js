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