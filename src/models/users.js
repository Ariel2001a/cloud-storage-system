// models/users.js
const fs = require('fs');
const path = require('path');

let idUsersCounter = 0;
const users = [];

// Creates a new user with the given info and returns it
const createUser = (first_name, last_name, email, password, image) => {
    const newUser = { id: ++idUsersCounter, first_name, last_name, email, password, image };
    users.push(newUser);
    return newUser;
};

// Checks if a name contains only valid letters
const isValidName = (name) => {
    const allowedChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 0; i < name.length; i++) {
        if (!allowedChars.includes(name[i])) return false;
    }
    return true;
};

const getUserById = (id) => users.find(u => u.id === id);

const getUserByUsername = (email) =>  users.find(u => u.email===email)


// Checks if a name contains only valid letters
const checkUserByUsername = (email) =>  users.find(u => u.email===email)

const checkUserByUsername = (email) => users.find(u => u.email === email);

module.exports = {
    createUser,
    isValidName,
    getUserById,
    checkUserByUsername,
    getUserByUsername
};