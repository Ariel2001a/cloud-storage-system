const permissions= {}

function addPermission ({UserId, fileId, permission}) {

    if (!permissions[UserId]) {
        permissions[UserId] = [];
    }

    const newPermission= {id: Date.now(), fileId, permission}
    permissions[UserId].push(newPermission);
    return newPermission;
}

module.exports= {addPermission, permissions};