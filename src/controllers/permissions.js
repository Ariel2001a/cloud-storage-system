const {addPermission}= require('../models/permissions');

function createPermission(req, res) {
    const fileId = req.params.id;
    const {userId,permission}= req.body;

    if(!userId || !permission) {
        return res.status(400).json({error: 'Missing fields'})
    }

    const newPermission = addPermission({userId, fileId, permission});
    return res.status(201).json(newPermission);
}

module.exports = {createPermission};

