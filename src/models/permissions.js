const permissionsByFile = {}; 

const PERMISSION_TYPES = ["read", "write", "execute"]; 

function addPermission({ userId, fileId, permission }) {

    if (!PERMISSION_TYPES.includes(permission)) {
        return null;
    }

    if (!permissionsByFile[fileId]) {
        permissionsByFile[fileId] = [];
    }


    const exists = permissionsByFile[fileId].some(
        p => p.userId === userId && p.permission === permission
    );

    if (exists) return null;

    const newPermission = { id: Date.now(), userId, fileId, permission };
    permissionsByFile[fileId].push(newPermission);

    return newPermission;
}

function getPermissionsByFile(fileId) {
    return permissionsByFile[fileId] || [];
}

module.exports = {
    addPermission,
    getPermissionsByFile,
    PERMISSION_TYPES
};
