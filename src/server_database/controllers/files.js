const { fileSocket } = require('../FileSocketClient'); // communicate with C++ server
const filesModel = require('../services/files');         // store/retrieve files
const User = require('../services/user');               // user model
const Permission = require('../services/permission');
const fs = require('fs');
const path = require('path');

let filesCounter = Date.now();

// ===== CREATE FILE OR FOLDER =====
exports.createFileOrFolder = async (req, res) => {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: 'User not logged in' });

    const { name, type, content, parentId } = req.body;
    if (!name || !type) return res.status(400).json({ error: "Missing Fields" });

    const user = await User.getUserById(parseInt(userId));
    if (!user) return res.status(404).json({ error: "User not found" });

    if (type === 'folder' && content != null) {
        console.log("invalid folder");
        return res.status(400).json({ error: "folder is without content!" });
    }

    if (parentId != null) {
        const parent = await filesModel.getFileById(Number(parentId));
        if (!parent || parent.type !== 'folder') {
            return res.status(400).json({ error: "Folder Parent does not exist" });
        }
    }

    try {
        let finalContentForCpp = content || '';
        let fileSize = 0;


        if (type === 'image' && content && content.startsWith('data:image')) {
            try {
                const matches = content.match(/^data:(.+);base64,(.+)$/);
                const ext = matches[1].split("/")[1];
                const data = matches[2];
                const buffer = Buffer.from(data, "base64");

                const uploadDir = path.join(__dirname, '../uploads');
                if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

                const fileName = `${Date.now()}-${name.replace(/\s+/g, '_')}`;
                const fullPath = path.join(uploadDir, fileName);

                console.log("Saving image to absolute path:", path.resolve(fullPath));

                fs.writeFileSync(fullPath, buffer);

                finalContentForCpp = `/uploads/${fileName}`;
                fileSize = buffer.length;
            } catch (err) {
                console.error("Image saving error:", err);
                return res.status(400).json({ error: "Invalid image data" });
            }
        } else if (type === 'file') {
            fileSize = Buffer.byteLength(content || '', 'utf8');
        }


        if (type === 'file' || type === 'image') {
            const cppResponse = await fileSocket.sendCommand(
                `POST ${++filesCounter} ${finalContentForCpp}`
            );

            if (cppResponse.includes("400")) return res.status(400).end();
            if (cppResponse.includes("500")) return res.status(500).end();
        } else {

            filesCounter = Date.now();
        }


        await filesModel.addFileOrFolder(userId, {
            id: filesCounter,
            name,
            type,
            date: Date.now(),
            size: fileSize,
            folderParent: parentId || null,
            path: type === 'image' ? finalContentForCpp : null,
        });

        const perms = Permission.PERMISSION_TYPES;
        console.log(perms);
        for (const p of perms) {
            let newPermission = await Permission.addPermission({
                userId: parseInt(userId),
                fileId: filesCounter,
                permission: p,
                type
            });

            console.log(newPermission);
        }

        return res.status(201).location(`/api/files/${filesCounter}`).json({ id: filesCounter });

    } catch (error) {
        console.error("Create error stack:", error.stack || error);
        return res.status(500).json({ error: error.message, stack: error.stack });
    }
};

// ===== GET TOP-LEVEL FILES =====
exports.getFiles = async (req, res) => {
    const userId = req.userId;

    if (!userId) return res.status(401).json({ error: 'User not logged in' });

    const user = await User.getUserById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const files = await filesModel.getTopLevelFiles(userId);
    res.json({ files });
};

exports.getDeletedFiles = async (req, res) => {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: 'User not logged in' });

    const user = await User.getUserById(parseInt(userId));
    if (!user) return res.status(404).json({ error: 'User not found' });

    const files = await filesModel.getUserDeletedFiles(userId);
    res.json({ files });
};


exports.getFolderChildren = async (req, res) => {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: 'User not logged in' });

    const folderId = req.params.id;

    const children = await filesModel.getFolderFiles(userId, folderId);
    res.json({ files: children });
};

exports.getRecentFiles = async (req, res) => {
    const userId = req.userId;
    if (!userId) {
        return res.status(401).json({ error: 'User not logged in' });
    }

    const user = await User.getUserById(parseInt(userId));
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    const files = await filesModel.getUserRecentFiles(userId);
    res.json({ files });
};

exports.getLastOpenFiles = async (req, res) => {
    const userId = req.userId;
    if (!userId) {
        return res.status(401).json({ error: 'User not logged in' });
    }

    const user = await User.getUserById(parseInt(userId));
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    const files = await filesModel.getUserLastOpenedFiles(userId);
    res.json({ files });
};

exports.getSharedFiles = async (req, res) => {
    const userId = req.userId;
    if (!userId) {
        return res.status(401).json({ error: 'User not logged in' });
    }

    const user = await User.getUserById(parseInt(userId));
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    const files = await filesModel.getUserSharedFiles(userId);
    res.json({ files });
};

exports.getStarredFiles = async (req, res) => {
    const userId = req.userId;
    if (!userId) {
        return res.status(401).json({ error: 'User not logged in' });
    }

    const user = await User.getUserById(parseInt(userId));
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    const files = await filesModel.getStarredFiles(userId);
    res.json({ files });
};

exports.getFileById = async (req, res) => {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: 'User not logged in' });

    const user = User.getUserById(parseInt(userId));
    if (!user) return res.status(404).json({ error: "User not found" });

    const fileId = req.params.id;
    const file = await filesModel.getFileById(parseInt(fileId));

    if (!file) return res.status(404).json({ error: 'File not found' });

    if(userId == file.ownerId){
        file.open = Date.now();
        file.save();
    }

    let content = ""

    if (file.type === "file" || file.type === "image") {
        try {
            const cppResponse = await fileSocket.sendCommand(`GET ${fileId.toString().trim()}`);
            if (cppResponse.startsWith("404")) {
                return res.status(404).json({ error: "File not found on storage server" });
            }

            const okIndex = cppResponse.toLowerCase().indexOf("ok");
            if (okIndex !== -1) {
                content = cppResponse.substring(okIndex + 2).trim();
            } else {
                content = cppResponse.trim();
            }
        }

        catch (err) {
            console.error("Socket Error:", err);
            return res.status(500).json({ error: "Failed to connect to storage server" });
        }
    }

    return res.json({
        ...file,
        content: content
    });
};


// Updates file or folder fields
exports.patchFileById = async (req, res) => {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: 'User not logged in' });

    const user = User.getUserById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const file = await filesModel.getFileById(parseInt(req.params.id));
    if (!file) return res.status(404).json({ error: 'File not found' });

    const { name, content, parentId } = req.body;
    console.log("controller:", parentId);

    let updateContent = false, updateName = false, updateParentId = false;

    if (content !== undefined) {
        if (file.type === 'folder') return res.status(400).json({ error: 'Folders cannot have content' });
        updateContent = true;
    }

    if (name !== undefined) {
        if (name.trim() === '') return res.status(400).json({ error: 'Invalid file name' });
        updateName = true;
    }

    if (parentId !== undefined) {


        if (parentId === null) {
            updateParentId = true;
        }

        else {
            const parent = await filesModel.getFileById(parentId);
            console.log("controller parent: ", parent);
            if (!parent || parent.type !== 'folder') {
                return res.status(400).json({ error: 'Folder Parent does not exist' });
            }
            updateParentId = true;
        }
    }


    if (updateName || updateContent || updateParentId) {
        if (updateName) file.name = name;
        if (updateParentId) file.folderParent = parentId;

        if (updateContent) {
            let finalContentForCpp = content || '';
            let newSize = Buffer.byteLength(content || '', 'utf8');

            if (file.type === 'image' && content.startsWith('data:image')) {
                try {
                    const matches = content.match(/^data:(.+);base64,(.+)$/);
                    const data = matches[2];
                    const buffer = Buffer.from(data, 'base64');


                    const fileName = `${Date.now()}-updated-${file.name.replace(/\s+/g, '_')}.png`;
                    const fullPath = path.join(__dirname, '../uploads', fileName);

                    fs.writeFileSync(fullPath, buffer);

                    finalContentForCpp = `/uploads/${fileName}`;
                    newSize = buffer.length;
                } catch (err) {
                    console.error("Image processing error:", err);
                    return res.status(400).json({ error: 'Invalid image data' });
                }
            }

            try {

                const cppResponseDelete = await fileSocket.sendCommand(`DELETE ${file.id}`);
                if (cppResponseDelete.includes("400") || cppResponseDelete.includes("500")) {
                    return res.status(500).json({ error: 'Failed to delete old content' });
                }


                const cppResponsePost = await fileSocket.sendCommand(`POST ${file.id} ${finalContentForCpp}`);
                if (cppResponsePost.includes("400") || cppResponsePost.includes("500")) {
                    return res.status(500).json({ error: 'Failed to post new content' });
                }


                file.content = finalContentForCpp;
                file.size = newSize;

            } catch (err) {
                console.error("Socket Error:", err);
                return res.status(500).end();
            }
        }

        await file.save();
        return res.status(200).json(file);
    }

    return res.status(400).json({ error: 'fields to update are required' });
};

// ===== DELETE FILE/FOLDER =====
exports.deleteFileById = async (req, res) => {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: 'User not logged in' });

    const user = await User.getUserById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const idToDelete = parseInt(req.params.id);

    let file = await filesModel.getFileById(idToDelete);

    if(file && file.ownerId != userId)
    {
        const permissionsUser = await Permission.getPermissionsUser(userId,idToDelete);
        for (const perm of permissionsUser) {
            await Permission.deletePermissionById(perm.id);
        }
        
        return res.status(204).end();
    }

    if (file && !file.bin) {
        await filesModel.deleteFileByIdFromUserFiles(userId, idToDelete);
        console.log("first delete controller2")


        if ((file.type === 'file' || file.type === 'image') && file.starred) {
            await filesModel.starOrUnstarFile(userId, idToDelete);
        }

        return res.status(204).end();
    }

    file = await filesModel.getFileByIdFromDeleted(userId, idToDelete);
    console.log("first delete controller1")

    if (!file) {
        return res.status(404).json({ error: 'File not found' });
    }

    const permissionsShare = await Permission.getPermissionsByFileId(idToDelete);
    for (const perm of permissionsShare) {
        await Permission.deletePermissionById(perm.id);
    }

    const deletePhysicalFile = (fileObj) => {
        if (fileObj.type === 'image' && fileObj.path) {
            const absolutePath = path.join(__dirname, '..', fileObj.path);
            if (fs.existsSync(absolutePath)) {
                fs.unlinkSync(absolutePath);
            }
        }
    };

    if (file.type === 'folder') {
        const idsInFolder = await filesModel.getFolderFiles(userId, idToDelete);

        if (idsInFolder != null) {
            for (const childId of idsInFolder) {
                const subFile = await filesModel.getFileByIdFromDeleted(userId, childId);

                if (subFile) {
                    deletePhysicalFile(subFile);

                    if (subFile.type === 'file' || subFile.type === 'image') {
                        await fileSocket.sendCommand(`DELETE ${childId}`);
                    }

                    await filesModel.deleteFileByIdFromBin(userId, childId);
                }
            }
        }
    }

    deletePhysicalFile(file);

    if (file.type === 'file' || file.type === 'image') {
        await fileSocket.sendCommand(`DELETE ${idToDelete}`);
    }

    await filesModel.deleteFileByIdFromBin(userId, idToDelete);
    console.log("delete controller")

    return res.status(204).end();
};


exports.starOrUnstarFile = async (req, res) => {
    const userId = req.userId;
    const { request } = req.body;
    let success = false;

    if (!userId) {
        return res.status(401).json({ error: 'User not logged in' });
    }

    const user = await User.getUserById(parseInt(userId));
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    const fileId = parseInt(req.params.id);
    if (request == "star") {
        success = await filesModel.starOrUnstarFile(userId, fileId);
    }
    if (request == "public") {
        success = await filesModel.doFilePublic(userId, fileId);
    }

    if (!success) {
        return res.status(404).json({ error: 'File not found' });
    }
    return res.status(204).end();
};


exports.restoreFileFromBin = async (req, res) => {
    const userId = req.userId;
    if (!userId) {
        return res.status(401).json({ error: 'User not logged in' });
    }

    const user = await User.getUserById(parseInt(userId));
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    const fileId = parseInt(req.params.id);
    const success = await filesModel.RestoreFileByIdFromBin(userId, fileId);
    console.log("controller:", success);
    if (!success) {
        return res.status(404).json({ error: 'File not found' });
    }
    return res.status(204).end();
};