const { fileSocket } = require('../FileSocketClient'); // communicate with C++ server
const filesModel = require('../models/files');         // store/retrieve files
const User = require('../models/users');               // user model
const { addPermission } = require('../models/permissions');
const { PERMISSION_TYPES } = require('../models/permissions');

// Initialize file ID counter
let filesCounter = Date.now(); 



// ===== CREATE FILE OR FOLDER =====
exports.createFileOrFolder = async (req, res) => {
    const userId = req.userId;                      // ✅ get userId from JWT
    const { name, type, content, parentId } = req.body;

    if (!userId) return res.status(401).json({ error: 'User not logged in' });

    const user = User.getUserById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (parentId != null) {
        const parent = filesModel.getFileById(userId, parentId);
        if (!parent || parent.type !== 'folder') {
            return res.status(400).json({ error: 'Folder Parent does not exist' });
        }
    }

    if (!name || !type) return res.status(400).json({ error: 'Missing Fields' });

    try {
        if (type === 'file') {
            const cppResponse = await fileSocket.sendCommand(
                `POST ${++filesCounter} ${content || ''}`
            );

            if (cppResponse.includes("400")) return res.status(400).end();
            if (cppResponse.includes("500")) return res.status(500).end();

            filesModel.addFileOrFolder(userId, {
                id: filesCounter,
                name,
                type,
                date: Date.now(),
                folderParent: parentId || null
            });

            PERMISSION_TYPES[type].forEach(p => {
                addPermission({ userId, fileId: filesCounter, permission: p, type });
            });

            return res.status(201).location(`/api/files/${filesCounter}`).json({ id: filesCounter });
        }

        if (type === 'folder') {
            if (content) return res.status(400).json({ error: 'Folders cannot have content' });

            filesModel.addFileOrFolder(userId, {
                id: ++filesCounter,
                name,
                type,
                date: Date.now(),
                folderParent: parentId || null
            });

            PERMISSION_TYPES[type].forEach(p => {
                addPermission({ userId, fileId: filesCounter, permission: p, type });
            });

            return res.status(201).location(`/api/files/${filesCounter}`).json({ id: filesCounter });
        }

        return res.status(400).json({ error: 'Invalid type' });
    } catch (error) {
        return res.status(500).end();
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


exports.getFolderChildren = (req, res) => {
    const userId = req.headers['user-id'];
    const folderId = req.params.id;

    const children = filesModel.getFolderFiles(userId, folderId);
    res.json({ files: children });
};

exports.getFileById = async (req, res) => {
    const userId = req.headers['user-id'];
    if (!userId) return res.status(401).json({ error: 'User not logged in' });

    const user = User.getUserById(parseInt(userId));
    if (!user) return res.status(404).json({ error: "User not found" });

    const fileId = req.params.id;
    const file = filesModel.getFileById(userId, parseInt(fileId));

    if (!file) return res.status(404).json({ error: 'File not found' });


    let content = file.type === "file" ? "" : null;

    if (file.type === "file") {
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
        const parent = filesModel.getFileById(userId, parentId);
        if (!parent || parent.type !== 'folder') return res.status(400).json({ error: 'Folder Parent does not exist' });
        updateParentId = true;
    }

    if (updateName || updateContent || updateParentId) {
        if (updateName) file.name = name;
        if (updateParentId) file.folderParent = parentId;

        if (updateContent) {
            try {
                const cppResponseDelete = await fileSocket.sendCommand(`DELETE ${file.id}`);
                if (cppResponseDelete.includes("400")) return res.status(400).json({ error: 'Delete' });
                if (cppResponseDelete.includes("500")) return res.status(500).json({ error: 'Delete' });

                const cppResponsePost = await fileSocket.sendCommand(`POST ${file.id} ${content || ''}`);
                if (cppResponsePost.includes("400")) return res.status(400).json({ error: 'Post' });
                if (cppResponsePost.includes("500")) return res.status(500).json({ error: 'Post' });
            } catch (err) {
                return res.status(500).end();
            }
            file.content = content;
        }
        return res.status(204).end();
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
    const file = filesModel.getFileById(userId, idToDelete);
    if (!file) return res.status(404).json({ error: 'File not found' });

    try {
        if (file.type === 'folder') {
            const id_files_in_folder = filesModel.getFolderFiles(userId, idToDelete);
            for (const id of id_files_in_folder) {
                filesModel.deleteFileById(userId, id);
                const cppResponseDelete = await fileSocket.sendCommand(`DELETE ${id}`);
                if (cppResponseDelete.includes("400") || cppResponseDelete.includes("500")) return res.status(500).end();
            }
        }

        filesModel.deleteFileById(userId, idToDelete);

        if (file.type === 'file') {
            const cppResponseDelete = await fileSocket.sendCommand(`DELETE ${idToDelete}`);
            if (cppResponseDelete.includes("400") || cppResponseDelete.includes("500")) return res.status(500).end();
        }

        return res.status(204).end();
    } catch (err) {
        return res.status(500).end();
    }
};


