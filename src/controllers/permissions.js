const User = require('../models/users');
const filesModel = require('../models/files');
const { addPermission, getPermissionsByFileId, updatePermissionById, PERMISSION_TYPES } = require('../models/permissions');

async function createPermission(req, res) {
    const fileId = parseInt(req.params.id, 10);
    const { userId, permission } = req.body;
    const ownerId = req.headers['user-id'];

   
    if (!ownerId) {
        return res.status(401).json({ error: 'User not logged in' });
    }

    const owner = User.getUserById(parseInt(ownerId));
    if (!owner) {
        return res.status(404).json({ error: 'User not found' });
    }

 
    const userFiles = filesModel.getUserFiles(ownerId);
    const file = userFiles.find(f => f.id == fileId);

    if (!file) {
        return res.status(404).json({ error: 'File or folder not found' });
    }

 
    if (!userId || !permission) {
        return res.status(400).json({ error: 'Missing fields' });
    }

 
    const targetUser = User.getUserById(parseInt(userId));
    if (!targetUser) {
        return res.status(404).json({ error: 'Target user not found' });
    }

    if (!PERMISSION_TYPES[file.type].includes(permission)) {
        return res.status(400).json({ error: `Invalid permission type for ${file.type}` });
    }


    const newPermission = addPermission({ userId, fileId, permission, type: file.type });
    if (!newPermission) {
        return res.status(409).json({ error: 'Permission already exists' });
    }

    return res.status(201).json(newPermission);
}


const getPermissionsByFile = (req, res) => {
    const ownerId = req.headers['user-id'];
    const fileId = req.params.id;

    const files = filesModel.getUserFiles(ownerId);
    const file = files.find(f => f.id == fileId);

    if (!file) {
        return res.status(404).json({ error: "File or folder not found" });
    }

    const permissions = getPermissionsByFileId(fileId);

    return res.status(200).json(permissions);
};
async function updatePermission(req, res) {
    const ownerId = req.headers['user-id'];
    const fileId = parseInt(req.params.id, 10);
    const pId = parseInt(req.params.pId, 10);
    const { permission } = req.body;

    if (!ownerId) return res.status(401).json({ error: 'User not logged in' });

    const file = filesModel.getUserFiles(ownerId).find(f => f.id === fileId);
    if (!file) return res.status(404).json({ error: 'File/folder not found.' });

    if (!PERMISSION_TYPES[file.type].includes(permission)) {
        return res.status(400).json({ error: `Invalid permission type for ${file.type}` });
    }

    const updated = updatePermissionById(pId, permission);
    if (!updated) return res.status(404).json({ error: 'Permission not found' });

    if (updated.userId == ownerId) {
        return res.status(403).json({ error: "You cannot modify your own permissions" });
    }

    const duplicate = getPermissionsByFileId(fileId).some(p => 
    p.userId === updated.userId &&
    p.permission === permission &&
    p.id !== updated.id
);

if (duplicate) {
    return res.status(409).json({ error: 'Permission already exists for this user' });
}

    return res.status(200).json(updated);
}

async function deletePermission(req, res) {
    const ownerId = req.headers['user-id'];
    const fileId = parseInt(req.params.id, 10);
    const pId = parseInt(req.params.pId, 10);

    if (!ownerId) {
        return res.status(401).json({ error: 'User not logged in' });
    }

    const file = filesModel.getUserFiles(ownerId).find(f => f.id === fileId);
    if (!file) {
        return res.status(404).json({ error: 'File or folder not found' });
    }

    const permissions = getPermissionsByFileId(fileId);
    const permissionIndex = permissions.findIndex(p => p.id === pId);

    if (permissionIndex === -1) {
        return res.status(404).json({ error: 'Permission not found' });
    }

    const deletedPermission = permissions.splice(permissionIndex, 1)[0];

    return res.status(200).json(deletedPermission);
}

module.exports = { createPermission, getPermissionsByFile, updatePermission, deletePermission};