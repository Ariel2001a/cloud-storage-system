const User = require('../models/users');
const filesModel = require('../models/files');
const { addPermission, getPermissionsByFileId, updatePermissionById, PERMISSION_TYPES } = require('../models/permissions');


/**
 * Create a new permission for a file or folder
 */
async function createPermission(req, res) {
    const fileId = parseInt(req.params.id, 10);
    const { userId, permission } = req.body;
    const ownerId = req.headers['user-id'];

   // Check if the request is from a logged-in user
    if (!ownerId) {
        return res.status(401).json({ error: 'User not logged in' });
    }

    const owner = User.getUserById(parseInt(ownerId));
    if (!owner) {
        return res.status(404).json({ error: 'User not found' });
    }

 
    // Ensure the owner has access to the file
    const userFiles = filesModel.getUserFiles(ownerId);
    const file = userFiles.find(f => f.id == fileId);

    if (!file) {
        return res.status(404).json({ error: 'File or folder not found' });
    }

 
    // Validate input
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


    // Add the permission
    const newPermission = addPermission({ userId, fileId, permission, type: file.type });
    if (!newPermission) {
        return res.status(409).json({ error: 'Permission already exists' });
    }
    
    let success = filesModel.sharedWithUsers(ownerId, fileId, userId);
    if (!success) {
        return res.status(400).json({ error: 'Failed to share file with user' });
    }
    return res.status(201).json(newPermission);
}

async function createPermissionByUsername(req, res) {
    const fileId = parseInt(req.params.id, 10);
    const { username, permission } = req.body;
    const ownerId = req.headers['user-id'];

   // Check if the request is from a logged-in user
    if (!ownerId) {
        return res.status(401).json({ error: 'User not logged in' });
    }

    const owner = User.getUserById(parseInt(ownerId));
    if (!owner) {
        return res.status(404).json({ error: 'User not found' });
    }

 
    // Ensure the owner has access to the file
    const userFiles = filesModel.getUserFiles(ownerId);
    const file = userFiles.find(f => f.id == fileId);

    if (!file) {
        return res.status(404).json({ error: 'File or folder not found' });
    }

 
    // Validate input
    if (!username || !permission) {
        return res.status(400).json({ error: 'Missing fields' });
    }

 
    const targetUser = User.getUserByUsername(username);
    if (!targetUser) {
        return res.status(404).json({ error: 'Target user not found' });
    }

    if (!PERMISSION_TYPES[file.type].includes(permission)) {
        return res.status(400).json({ error: `Invalid permission type for ${file.type}` });
    }

    let userId = targetUser.id;

    // Add the permission
    const newPermission = addPermission({ userId, fileId, permission, type: file.type });
    if (!newPermission) {
        return res.status(409).json({ error: 'Permission already exists' });
    }
    
    let success = filesModel.sharedWithUsers(ownerId, fileId, userId);
    if (!success) {
        return res.status(400).json({ error: 'Failed to share file with user' });
    }
    return res.status(201).json(newPermission);
}



/**
 * Get all permissions for a file or folder
 */
const getPermissionsByFile = (req, res) => {
    const ownerId = req.headers['user-id'];
    const fileId = req.params.id;

    // Ensure the owner has access
    const files = filesModel.getUserFiles(ownerId);
    const file = files.find(f => f.id == fileId);
    if (!file) {
        return res.status(404).json({ error: "File or folder not found" });
    }

    // Fetch and return permissions
    const permissions = getPermissionsByFileId(fileId);
    return res.status(200).json(permissions);
};

const getPermissionsBySharedFile = (req, res) => {
    const ownerId = req.headers['user-id'];
    const fileId = req.params.id;

    // Ensure the owner has access
    const files = filesModel.getUserSharedFiles(ownerId);
    const file = files.find(f => f.id == fileId);
    if (!file) {
        return res.status(404).json({ error: "File or folder not found" });
    }

    // Fetch and return permissions
    const permissions = getPermissionsByFileId(fileId);
    return res.status(200).json(permissions);
};

const getPermissionsByDeletedFile = (req, res) => {
    const ownerId = req.headers['user-id'];
    const fileId = req.params.id;

    // Ensure the owner has access
    const files = filesModel.getUserDeletedFiles(ownerId);
    const file = files.find(f => f.id == fileId);
    if (!file) {
        return res.status(404).json({ error: "File or folder not found" });
    }

    // Fetch and return permissions
    const permissions = getPermissionsByFileId(fileId);
    return res.status(200).json(permissions);
};

/**
 * Update an existing permission
 */
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

    // Prevent owner from changing their own permission
    if (updated.userId == ownerId) {
        return res.status(403).json({ error: "You cannot modify your own permissions" });
    }

    // Prevent duplicate permissions for the same user
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

/**
 * Delete a permission by its ID
 */
async function deletePermission(req, res) {
    const ownerId = req.headers['user-id'];
    const fileId = parseInt(req.params.id, 10);
    const pId = parseInt(req.params.pId, 10);

    if (!ownerId) {
        return res.status(401).json({ error: 'User not logged in' });
    }

    // Check that the file belongs to the user
    const file = filesModel.getUserFiles(ownerId).find(f => f.id === fileId);
    if (!file) {
        return res.status(404).json({ error: 'File or folder not found' });
    }

    // Get permissions for this file
    const permissions = getPermissionsByFileId(fileId);
    const permissionIndex = permissions.findIndex(p => p.id === pId);

    if (permissionIndex === -1) {
        return res.status(404).json({ error: 'Permission not found' });
    }

    const permission = permissions[permissionIndex];

    //  Owner cannot delete their own permission
    if (permission.userId == ownerId) {
        return res.status(403).json({
            error: 'Owner cannot delete their own permission'
        });
    }

    return res.status(204).end();
}

module.exports = { createPermissionByUsername, getPermissionsByFile, updatePermission, deletePermission,
                    getPermissionsBySharedFile,getPermissionsByDeletedFile };