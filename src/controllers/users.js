const User = require('../models/users')

exports.createUser = (req, res) => {
    const { first_name,last_name,email,password,image } = req.body
    const profileImage = image || 'default.png';
    if (!first_name || !last_name || !email || !password)
        return res.status(400).json({ error: 'Missing required fields' })
    const newUser = User.createUser(first_name,last_name,email,password,profileImage)
    res.status(201).location(`/api/users/${newUser.id}`).json({ id: newUser.id })
}

exports.getUserById = (req, res) => {
    const user = User.getUserById(parseInt(req.params.id))
    if (!user)
    return res.status (404).json({ error: 'User not found' })
    res.json(user)
}