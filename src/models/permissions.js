const permissionsByFile = {}; 

const PERMISSION_TYPES = {
    file: ["read", "write", "owner"],
    folder: ["read", "write", "share", "owner"]
}; 

function addPermission({ userId, fileId, permission,type }) {

    if (!PERMISSION_TYPES[type].includes(permission)) {
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


function getPermissionsByFileId(fileId) {
    return permissionsByFile[fileId] || [];
}

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

function deletePermissionById(pId) {
    for (const fileId in permissionsByFile) {
        const index = permissionsByFile[fileId].findIndex(p => p.id === pId);
        if (index !== -1) {
            return permissionsByFile[fileId].splice(index, 1)[0];
        }
    }
    return null;
}


module.exports = {
    addPermission,
    getPermissionsByFile,
    getPermissionsByFileId,
    updatePermissionById,
    deletePermissionById,
    PERMISSION_TYPES
};
