const Permission = require ('../models/permission');
const PERMISSION_TYPES = ["read", "write", "owner"];

/**
 * Add a new permission for a user on a file or folder
 * @param {Object} param0 - Contains userId, fileId, permission, type (file/folder)
 * @returns {Object|null} - Returns the added permission object or null if invalid/exists
 */

const getUserPermissionsByFilterPermission = async (userId, fileId, permission) => {
  return await Permission.find({ userId: userId, fileId : fileId, permission : permission }) || [];
};


const addPermission = async ( userId, fileId, permission, type ) => {

    // Validate permission type
    if (!PERMISSION_TYPES.includes(permission)) {
        return null;
    }

    let permissions = getUserPermissionsByFilterPermission(userId, fileId, permission);

    // Initialize array for file if not exists
    if (!permissions || permissions.length === 0) {
        return null;
    }

    // Create and store new permission
    const newPermission = new Permission({
        userId: userId,
        fileId: fileId,
        permission: permission
    });

    await newPermission.save();
    return newPermission;
}

/**
 * Get all permissions for a given fileId
 */
const getPermissionsByFileId = async (fileId) => {
    return  await Permission.find({fileId : fileId }) || [];
}

/**
 * Update a permission by its unique id
 * @param {number} pId - Permission ID
 * @param {string} newPermission - New permission value
 * @returns {Object|null} - Updated permission object or null if not found
 */
const updatePermissionById = async (pId, newPermission) => {
    const permission = Permission.find({ id : pId }) || [];
    if (!permission || permission.length === 0) {
        return null;
    }

    permission.permission = newPermission;
    await permission.save();
    return permission;
}

/**
 * Delete a permission by its unique id
 * @param {number} pId - Permission ID
 * @returns {Object|null} - Deleted permission object or null if not found
 */

const deletePermissionById = async(pId) => {
    const permission = Permission.find({ id : pId }) || [];    
    if (!permission) {
        return false;
    }

    await permission.remove();
    return true;
};

// Export functions and permission types
module.exports = {
    addPermission,
    getPermissionsByFileId,
    updatePermissionById,
    deletePermissionById,
    PERMISSION_TYPES
};


