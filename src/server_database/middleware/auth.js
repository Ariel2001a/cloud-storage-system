// src/middleware/auth.js
const jwt = require('jsonwebtoken');
const SECRET_KEY = "AED_super_secret_key";

function isLoggedIn(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(403).send('Token required');
  }

  const token = authHeader.split(" ")[1]; // Expect "Bearer <token>"
  try {
    const data = jwt.verify(token, SECRET_KEY);
    console.log('The logged in user is: ' + data.username);
    req.userId = data.id; // attach userId to request
    next();
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
}

module.exports = isLoggedIn;


