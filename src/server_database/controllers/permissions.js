const User = require('../services/user');
const filesModel = require('../services/files');
const Permission = require('../services/permission');


/**
 * Create a new permission for a file or folder
 */
/*
async function createPermission(req, res) {
    const fileId = parseInt(req.params.id, 10);
    const { userId, permission } = req.body;
    const ownerId = req.userId; 

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
*/

async function createPermissionByUsername(req, res) {
    const fileId = parseInt(req.params.id, 10);
    const { username, permission } = req.body;
    const ownerId = req.userId;
; 

   // Check if the request is from a logged-in user
    if (!ownerId) {
        return res.status(401).json({ error: 'User not logged in' });
    }

    const owner = await User.getUserById(parseInt(ownerId));
    if (!owner) {
        return res.status(404).json({ error: 'User not found' });
    }

      // Validate input
    if (!username || !permission) {
        return res.status(400).json({ error: 'Missing fields' });
    }

 
    const targetUser = await User.getUserByUsername(username);
    if (!targetUser) {
        return res.status(404).json({ error: 'Target user not found' });
    }
    
    // Ensure the owner has access to the file
    const file = await filesModel.getFileById(ownerId,fileId);

    if (!file) {
        return res.status(404).json({ error: 'File or folder not found' });
    }


    if (!Permission.PERMISSION_TYPES.includes(permission)) {
        return res.status(400).json({ error: `Invalid permission type for ${file.type}` });
    }

    let userId = targetUser.id;

    // Add the permission
    const newPermission = await Permission.addPermission({ userId, fileId, permission, type: file.type });
    if (newPermission == null) {
        return res.status(409).json({ error: 'Permission already exists' });
    }

    return res.status(201).json(newPermission);
}

/**
 * Get all permissions for a file or folder
 */
const getPermissionsByFile = async (req, res) => {
    const ownerId = req.userId;
; 
    if (!ownerId) {
        return res.status(401).json({ error: 'User not logged in' });
    }
    const fileId = req.params.id;

    // Ensure the owner has access
    const file = await filesModel.getFileById(ownerId,fileId);
    if (!file) {
        return res.status(404).json({ error: "File or folder not found" });
    }

    // Fetch and return permissions
    const permissions = await Permission.getPermissionsByFileId(fileId);
    return res.status(200).json(permissions);
};

const getPermissionsBySharedFile = async(req, res) => {
    const ownerId = req.userId;
    if (!ownerId) {
        return res.status(401).json({ error: 'User not logged in' });
    }
    const fileId = Number(req.params.id);
    const pId = Number(req.params.pId);


    // Ensure the owner has access
    const file = await filesModel.getFileByIdFromShared(ownerId, fileId) ;
    console.log("controller:", file);

    if (!file) {
        return res.status(404).json({ error: "File or folder not found" });
    }

    // Fetch and return permissions
    const permissions = await Permission.getPermissionsByFileId(fileId);    
    const perm = permissions.find(p => p.id === pId);
    console.log("perm : " , perm);
    return res.status(200).json(perm);
};

const getPermissionsByDeletedFile = async (req, res) => {
    const ownerId = req.userId;
    if (!ownerId) {
        return res.status(401).json({ error: 'User not logged in' });
    }
    const fileId = Number(req.params.id);
    const permissionId = Number(req.params.pId);

    // Ensure the owner has access
    const file = await filesModel.getFileByIdFromDeleted(ownerId, fileId) ;
    if (!file) {
        return res.status(404).json({ error: "File or folder not found" });
    }

    // Fetch and return permissions
    const permissions = await Permission.getPermissionsByFileId(fileId);
    const perm = permissions.find(p => p.id === permissionId);
    console.log("perm : " , perm);
    return res.status(200).json(perm);
};

/**
 * Update an existing permission
 */
async function updatePermission(req, res) {
    const ownerId = req.userId;
    const fileId = parseInt(req.params.id, 10);
    const pId = parseInt(req.params.pId, 10);
    const { permission } = req.body;

    if (!ownerId) return res.status(401).json({ error: 'User not logged in' });

    const files = await filesModel.getUserFiles(ownerId);
    const file = files.find(f => f.id === fileId);
    if (!file) return res.status(404).json({ error: 'File/folder not found.' });

    if (!Permission.PERMISSION_TYPES.includes(permission)) {
        return res.status(400).json({ error: `Invalid permission type for ${file.type}` });
    }

    const updated = await Permission.updatePermissionById(pId, permission);
    if (!updated) return res.status(404).json({ error: 'Permission not found' });

    // Prevent owner from changing their own permission
    if (updated.userId == ownerId) {
        return res.status(403).json({ error: "You cannot modify your own permissions" });
    }

    // Prevent duplicate permissions for the same user
    const duplicate = await Permission.getPermissionsByFileId(fileId).some(p => 
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
    const ownerId = req.userId;
    const fileId = parseInt(req.params.id, 10);
    const pId = parseInt(req.params.pId, 10);

    if (!ownerId) {
        return res.status(401).json({ error: 'User not logged in' });
    }

    // Check that the file belongs to the user
    const file = await filesModel.getFileById(ownerId, fileId);
    if (!file) {
        return res.status(404).json({ error: 'File or folder not found' });
    }

    // Get permissions for this file
    const permissions = await Permission.getPermissionsByFileId(fileId);
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

    await Permission.deletePermissionById(pId);

    return res.status(204).end();
}

const getPermissionsByDetails = async (req, res) => {
    const ownerId = req.userId;
    const {username} = req.query; 
    const fileId = req.params.id;
    const { permission } = req.query;

    if (!ownerId) {
        return res.status(401).json({ error: 'User not logged in' });
    }

    if (!username || !permission) {
        return res.status(400).json({ error: 'Missing fields' });
    }

    const targetUser = await User.getUserByUsername(username+"@ead.com");
    if (!targetUser) {
        return res.status(404).json({ error: 'Target user not found' });
    }

    let userId = targetUser.id;

    // Ensure the owner has access

    let file = await filesModel.getFileById(ownerId, fileId);


    if (!file) {
        file = await filesModel.getFileByIdFromShared(ownerId, fileId);

        if(!file){
            return res.status(404).json({ error: "File or folder not found" });
        }
    }

    if (!Permission.PERMISSION_TYPES.includes(permission)) {
        return res.status(400).json({ error: `Invalid permission type for ${file.type}` });
    }

    const permissionUser = await Permission.getUserPermissionsByFilterPermission(userId, fileId, permission) || [];
    if(permissionUser.length > 0){
        return res.json({ allowed: true });

    }else{
        return res.json({ allowed: false });
    }
};

module.exports = { createPermissionByUsername, getPermissionsByFile, updatePermission, deletePermission,
                    getPermissionsBySharedFile,getPermissionsByDeletedFile, getPermissionsByDetails };