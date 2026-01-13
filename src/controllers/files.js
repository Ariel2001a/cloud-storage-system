const { fileSocket } = require('../FileSocketClient'); // communicate with C++ server
const filesModel = require('../models/files');         // store/retrieve files
const User = require('../models/users');               // user model
const { addPermission, getPermissionsByFileId } = require('../models/permissions');
const { PERMISSION_TYPES } = require('../models/permissions');
const fs = require('fs');
const path = require('path');

// Initialize file ID counter
let filesCounter = Date.now();


// ===== CREATE FILE OR FOLDER =====
exports.createFileOrFolder = async (req, res) => {
    const userId = req.userId;
    const { name, type, content, parentId } = req.body;
    const user = User.getUserById(parseInt(userId));

    if (!userId) return res.status(401).json({ error: 'User not logged in' });
    if (!user) return res.status(404).json({ error: "User not found" });

    if (parentId != null) {
        const parent = filesModel.getFileById(userId, parentId);
        if (!parent || parent.type !== 'folder') {
            return res.status(400).json({ error: "Folder Parent does not exist" });
        }
    }

    if (!name || !type) return res.status(400).json({ error: "Missing Fields" });

    try {
        let finalContentForCpp = content || '';
        let fileSize = 0;

        // --- טיפול מיוחד בתמונה ---
        if (type === 'image' && content && content.startsWith('data:image')) {
            try {
                const matches = content.match(/^data:(.+);base64,(.+)$/);
                const ext = matches[1].split("/")[1]; // למשל png או jpeg
                const data = matches[2];
                const buffer = Buffer.from(data, "base64");

                const uploadDir = path.join(__dirname, '../uploads');
                if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

                const fileName = `${Date.now()}-${name.replace(/\s+/g, '_')}`;
                const fullPath = path.join(uploadDir, fileName);

                console.log("Saving image to absolute path:", path.resolve(fullPath));

                fs.writeFileSync(fullPath, buffer);

                // במקום לשלוח ל-C++ את כל ה-Base64, נשלח רק את ה-URL
                finalContentForCpp = `/uploads/${fileName}`;
                fileSize = buffer.length;
            } catch (err) {
                console.error("Image saving error:", err);
                return res.status(400).json({ error: "Invalid image data" });
            }
        } else if (type === 'file') {
            fileSize = Buffer.byteLength(content || '', 'utf8');
        }

        // --- שליחה לשרת C++ (עבור תמונה נשלח רק את הנתיב) ---
        if (type === 'file' || type === 'image') {
            const cppResponse = await fileSocket.sendCommand(
                `POST ${++filesCounter} ${finalContentForCpp}`
            );

            if (cppResponse.includes("400")) return res.status(400).end();
            if (cppResponse.includes("500")) return res.status(500).end();
        } else {
            // עבור תיקייה
            filesCounter++;
        }

        // --- שמירה במודל המקומי (Database/JSON) ---
        filesModel.addFileOrFolder(userId, {
            id: filesCounter,
            name,
            type, // 'file', 'folder' או 'image'
            date: Date.now(),
            size: fileSize,
            folderParent: parentId || null,
            starred: false,
            // אם זו תמונה, נשמור את הנתיב כדי שנוכל להציג אותה ב-Frontend
            path: type === 'image' ? finalContentForCpp : null,
            pub : false
        });

        // הוספת הרשאות
        const perms = PERMISSION_TYPES[type] || PERMISSION_TYPES['file'];
        perms.forEach(p => {
            addPermission({
                userId: parseInt(userId),
                fileId: filesCounter,
                permission: p,
                type
            });
        });

        return res.status(201).location(`/api/files/${filesCounter}`).json({ id: filesCounter });

    } catch (error) {
        console.error("Create error stack:", error.stack || error);
        return res.status(500).json({ error: error.message, stack: error.stack });
    }
};

// ===== GET TOP-LEVEL FILES =====
exports.getFiles = (req, res) => {
    const userId = req.userId;

    if (!userId) return res.status(401).json({ error: 'User not logged in' });

    const user = User.getUserById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const files = filesModel.getTopLevelFiles(userId);
    res.json({ files });
};

exports.getDeletedFiles = (req, res) => {
    const userId = req.userId;
    console.log(userId);
    if (!userId) return res.status(401).json({ error: 'User not logged in' });

    const user = User.getUserById(parseInt(userId));
    if (!user) return res.status(404).json({ error: 'User not found' });

    const files = filesModel.getUserDeletedFiles(userId);
    res.json({ files });
};


exports.getFolderChildren = (req, res) => {
    const userId = req.userId;
    const folderId = req.params.id;
    const numericFolderId = Number(folderId);
    const children = filesModel.getFolderFiles(userId, folderId);
    res.json({ files: children });
};

exports.getRecentFiles = (req, res) => {
    const userId = req.userId;
    const user = User.getUserById(parseInt(userId));

    if (!userId) {
        return res.status(401).json({ error: 'User not logged in' });
    }

    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    const files = filesModel.getUserRecentFiles(userId);
    res.json({ files });
};

exports.getSharedFiles = (req, res) => {
    const userId = req.userId;
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

exports.getStarredFiles = (req, res) => {
    const userId = req.userId;
    const user = User.getUserById(parseInt(userId));

    if (!userId) {
        return res.status(401).json({ error: 'User not logged in' });
    }

    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    const files = filesModel.getStarredFiles(userId);
    res.json({ files });
};

exports.getFileById = async (req, res) => {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: 'User not logged in' });

    const user = User.getUserById(parseInt(userId));
    if (!user) return res.status(404).json({ error: "User not found" });

    const fileId = req.params.id;
    const file = filesModel.getFileById(userId, parseInt(fileId));

    if (!file) return res.status(404).json({ error: 'File not found' });


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

    const file = filesModel.getFileById(userId, parseInt(req.params.id));
    if (!file) return res.status(404).json({ error: 'File not found' });

    const { name, content, parentId } = req.body;
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

        // ROOT (My Drive)
        if (parentId === null) {
            updateParentId = true;
        } 
        // תיקייה רגילה
        else {
            const parent = filesModel.getFileById(userId, parentId);
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


                file.content = finalContentForCpp; // הנתיב או הטקסט
                file.size = newSize;
            } catch (err) {
                console.error("Socket Error:", err);
                return res.status(500).end();
            }
        }


        return res.status(200).json(file);
    }

    return res.status(400).json({ error: 'fields to update are required' });
};

// ===== DELETE FILE/FOLDER =====
exports.deleteFileById = async (req, res) => {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: 'User not logged in' });

    const user = User.getUserById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const idToDelete = parseInt(req.params.id);
    let file = filesModel.getFileById(userId, idToDelete);


    if (!file) {
        file = filesModel.getFileByIdFromDeleted(userId, idToDelete);
        if (!file) {
            return res.status(404).json({ error: 'File not found' });
        }

        const permissionsShare = getPermissionsByFileId(idToDelete);
        const userIds = permissionsShare.map(permissionsShare => permissionsShare.userId);

        userIds.forEach(userShareId => {
            filesModel.deleteFileByIdFromSharedFiles(userShareId,idToDelete)
        });

        const deletePhysicalFile = (fileObj) => {
            if (fileObj.type === 'image' && fileObj.content) {

                const absolutePath = path.join(__dirname, '..', fileObj.content);
                if (fs.existsSync(absolutePath)) {
                    try {
                        fs.unlinkSync(absolutePath);
                        console.log(`Deleted physical file: ${absolutePath}`);
                    } catch (err) {
                        console.error(`Failed to delete physical file: ${err.message}`);
                    }
                }
            }
        };

        if (file.type === 'folder') {
            const id_files_in_folder = filesModel.getFolderFiles(userId, idToDelete);
            for (const id of id_files_in_folder) {

                const subFile = filesModel.getFileByIdFromDeleted(userId, id);
                if (subFile) deletePhysicalFile(subFile);

                filesModel.deleteFileByIdFromBin(userId, id);
                try {
                    await fileSocket.sendCommand(`DELETE ${id}`);
                } catch (error) {
                    return res.status(500).end();
                }
            }
        }


        deletePhysicalFile(file);
        filesModel.deleteFileByIdFromBin(userId, idToDelete);


        if (file.type === 'file' || file.type === 'image') {
            try {
                const cppResponseDelete = await fileSocket.sendCommand(`DELETE ${idToDelete}`);
                if (cppResponseDelete.includes("400") || cppResponseDelete.includes("500")) {
                    return res.status(500).json({ error: 'C++ Delete Failed' });
                }
            } catch (error) {
                return res.status(500).end();
            }
        }
    }

    else {
        filesModel.deleteFileByIdFromUserFiles(userId, idToDelete);
        if (file.type === 'file' || file.type === 'image') {
            if (file.starred) {
                filesModel.starOrUnstarFile(userId, idToDelete);
            }
        }
    }

    return res.status(204).end();
};

exports.starOrUnstarFile = (req, res) => {
    const userId = req.userId; 
    const {request} = req.body;
    let success = false;

    const user = User.getUserById(parseInt(userId));
    if (!userId) {
        return res.status(401).json({ error: 'User not logged in' });
    }
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    const fileId = parseInt(req.params.id);
    if(request == "star"){
        success = filesModel.starOrUnstarFile(userId, fileId);
    }
    if(request == "public"){
        success = filesModel.doFilePublic(userId, fileId);
    }
  
    if (!success) {
        return res.status(404).json({ error: 'File not found' });
    }
    return res.status(204).end();
};


exports.restoreFileFromBin = (req, res) => {
    const userId = req.userId;
    const user = User.getUserById(parseInt(userId));
    if (!userId) {
        return res.status(401).json({ error: 'User not logged in' });
    }
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    const fileId = parseInt(req.params.id);
    const success = filesModel.RestoreFileByIdFromBin(userId, fileId);
    if (!success) {
        return res.status(404).json({ error: 'File not found' });
    }
    return res.status(204).end();
};