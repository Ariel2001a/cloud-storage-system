// controllers/users.js
const User = require('../models/users');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

// JWT key
const SECRET_KEY = "AED_super_secret_key";

// Creates a new user with validation and returns the new user's ID
exports.createUser = (req, res) => {
    const { first_name, last_name, email, password, image } = req.body;

    if (User.checkUserByUsername(email)) {
        return res.status(400).json({ error: 'username exists in the system' });
    }

    let profileImage = "default.png"; // default image

    if (image && image.trim() !== "") {
        try {
            const matches = image.match(/^data:(.+);base64,(.+)$/);
            if (!matches) throw new Error("Invalid image format");

            const ext = matches[1].split("/")[1]; // png, jpeg
            const data = matches[2];
            const buffer = Buffer.from(data, "base64");

            // Ensure /uploads exists
            const uploadDir = path.join(__dirname, '../uploads');
            if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

            profileImage = `${Date.now()}.${ext}`;
            fs.writeFileSync(path.join(uploadDir, profileImage), buffer);
        } catch (err) {
            console.error("Error saving image:", err);
            return res.status(400).json({ error: 'Invalid image data' });
        }
    }

    // Validation
    if (!first_name || !last_name || !email || !password) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!User.isValidName(first_name)) {
        return res.status(400).json({ error: 'First name contains invalid characters' });
    }

    if (!User.isValidName(last_name)) {
        return res.status(400).json({ error: 'Last name contains invalid characters' });
    }

    const newUser = User.createUser(first_name, last_name, email, password, profileImage);
    res.status(201).location(`/api/users/${newUser.id}`).json({ id: newUser.id });
};

// Retrieves a user's details by their ID
exports.getUserById = (req, res) => {
    const user = User.getUserById(parseInt(req.params.id));
    if (!user)
        return res.status(404).json({ error: 'User not found' });

    res.json({
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        image: user.image
    });
};

// Checks credentials and returns JWT
exports.checkUser = (req, res) => {
    let { email, password } = req.body;

    if (!email.includes('@')) email += '@ead.com';

    const user = User.checkUserByUsername(email);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (user.password !== password) return res.status(404).json({ error: 'Password incorrect' });

    const username = email.split('@')[0];
    const token = jwt.sign({ id: user.id, username }, SECRET_KEY, { expiresIn: '1h' });

    res.json({ token, username });
};
