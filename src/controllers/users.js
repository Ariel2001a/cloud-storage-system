const User = require('../models/users')
const jwt = require('jsonwebtoken');

// Creates a new user with validation and returns the new user's ID
exports.createUser = (req, res) => {
    const { first_name, last_name, email, password, image } = req.body
    if (User.checkUserByUsername(email))
        return res.status(400).json({ error: 'username exists in the system' })

    let profileImage = ""
    if (!image || image.trim() === "")
        profileImage = "default.png"
    else
        profileImage = image

    if (!first_name || first_name.trim() === "" ||
        !last_name || last_name.trim() === "" ||
        !email || email.trim() === "" ||
        !password || password.trim() === "") {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!User.isValidName(first_name)) {
        return res.status(400).json({ error: 'First name contains invalid characters' });
    }

    if (!User.isValidName(last_name)) {
        return res.status(400).json({ error: 'Last name contains invalid characters' });
    }

    const newUser = User.createUser(first_name, last_name, email, password, profileImage)
    res.status(201).location(`/api/users/${newUser.id}`).json({ id: newUser.id })
}



//JWT key
const SECRET_KEY = "AED_super_secret_key";


// Retrieves a user's details by their ID
exports.getUserById = (req, res) => {
    const user = User.getUserById(parseInt(req.params.id))
    if (!user)
        return res.status(404).json({ error: 'User not found' })
    res.json({
        'id': user.id, 'first_name': user.first_name, 'last_name': user.last_name,
        'email': user.email, 'image': user.image
    })
}

// Retrieves a user's details by their ID
exports.checkUser = (req, res) => {
    let { email, password } = req.body;

    // If user submitted just "a", assume the domain is @ead.com
    if (!email.includes('@')) {
        email = email + '@ead.com';
    }

    // Extract username safely
    const username = email.split('@')[0];

    // 1️⃣ Find the user by email
    const user = User.checkUserByUsername(email);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    // 2️⃣ Check password
    if (user.password !== password) {
        return res.status(404).json({ error: 'Password incorrect' });
    }

    // 3️⃣ Login successful → create JWT
    const token = jwt.sign(
        { id: user.id, username },  // include username in payload
        SECRET_KEY,
        { expiresIn: '5h' }
    );

    // 4️⃣ Send JWT to frontend
    res.json({ token, username });
};

