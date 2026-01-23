// controllers/users.js
const User = require('../services/user');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

// JWT key
const SECRET_KEY = "AED_super_secret_key";

// Creates a new user with validation and returns the new user's ID
exports.createUser = async (req, res) => {
    try{
        const { first_name, last_name, email, password, image } = req.body;

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

        let existsUser = await User.getUserByUsername(email);
        console.log(existsUser);
        if (existsUser) {
            return res.status(400).json({ error: 'username exists in the system' });
        }

        let profileImage = null;

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

        const newUser = await User.createUser(first_name, last_name, email, password, profileImage);
        res.status(201).location(`/api/users/${newUser.id}`).json({ id: newUser.id });
    }catch(err){
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });        
    }
};

// Retrieves a user's details by their ID
exports.getUserById = async (req, res) => {
    try {
        const userId = Number(req.params.id);
        if (Number.isNaN(userId)) {
            return res.status(400).json({ error: 'Invalid user id' });
        }

        const user = await User.getUserById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            image: user.image
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};


// Checks credentials and returns JWT
exports.checkUser = async (req, res) => {
    try {
        let { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Missing fields' });
        }

        if (!email.includes('@')) {
            email += '@ead.com';
        }

        const user = await User.getUserByUsername(email);
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        if (user.password !== password) {
            return res.status(401).json({ error: 'Password incorrect' });
        }

        const username = email.split('@')[0];
        // Login successful → create JWT
        const token = jwt.sign(
            { id: user.id, username }, // include username in payload
            SECRET_KEY,
            { expiresIn: '1h' }
        );

        res.json({ token, username });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

