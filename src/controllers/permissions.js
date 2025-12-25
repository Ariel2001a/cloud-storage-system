const User = require('../models/users');
const filesModel = require('../models/files');
const { addPermission, getPermissionsByFileId, PERMISSION_TYPES } = require('../models/permissions');

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

    permissions.push({userId: file.ownerId || ownerId, fileId, permission: "owner"});

    return res.status(200).json(permissions);
};

module.exports = { createPermission, getPermissionsByFile };