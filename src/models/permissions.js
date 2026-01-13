// In-memory storage for permissions, organized by fileId
const permissionsByFile = {};

// Allowed permission types for files and folders
const PERMISSION_TYPES = {
    file: ["read", "write", "owner"],
    folder: ["read", "write", "share", "owner"],
    image: ["read", "write", "owner"]
};


/**
 * Add a new permission for a user on a file or folder
 * @param {Object} param0 - Contains userId, fileId, permission, type (file/folder)
 * @returns {Object|null} - Returns the added permission object or null if invalid/exists
 */
function addPermission({ userId, fileId, permission, type }) {

    // Validate permission type
    if (!PERMISSION_TYPES[type].includes(permission)) {
        return null;
    }

    // Initialize array for file if not exists
    if (!permissionsByFile[fileId]) {
        permissionsByFile[fileId] = [];
    }

    // Check if permission already exists for this user
    const exists = permissionsByFile[fileId].some(
        p => p.userId === userId && p.permission === permission
    );

    if (exists) return null;

    // Create and store new permission
    const newPermission = { id: Date.now(), userId, fileId, permission };
    permissionsByFile[fileId].push(newPermission);

    return newPermission;
}

/**
 * Get all permissions for a given fileId
 * @param {string|number} fileId
 * @returns {Array} - Array of permission objects
 */
function getPermissionsByFile(fileId) {
    return permissionsByFile[fileId] || [];
}

/**
 * Alias function to get permissions by fileId (same as getPermissionsByFile)
 */
function getPermissionsByFileId(fileId) {
    return permissionsByFile[fileId] || [];
}

/**
 * Update a permission by its unique id
 * @param {number} pId - Permission ID
 * @param {string} newPermission - New permission value
 * @returns {Object|null} - Updated permission object or null if not found
 */
function updatePermissionById(pId, newPermission) {
    for (const fileId in permissionsByFile) {
        const perm = permissionsByFile[fileId].find(p => p.id === pId);
        if (perm) {
            perm.permission = newPermission;
            return perm;
        }
    }
    return null;
}

/**
 * Delete a permission by its unique id
 * @param {number} pId - Permission ID
 * @returns {Object|null} - Deleted permission object or null if not found
 */
function deletePermissionById(pId) {
    for (const fileId in permissionsByFile) {
        const index = permissionsByFile[fileId].findIndex(p => p.id === pId);
        if (index !== -1) {
            return permissionsByFile[fileId].splice(index, 1)[0];
        }
    }
    return null;
}

// Export functions and permission types
module.exports = {
    addPermission,
    getPermissionsByFile,
    getPermissionsByFileId,
    updatePermissionById,
    deletePermissionById,
    PERMISSION_TYPES
};


