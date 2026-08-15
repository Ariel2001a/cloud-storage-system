const User = require ("../models/users");

const createUser = async (first_name, last_name, email, password, image) => {
    const newUser = new User ({
        first_name : first_name,
        last_name : last_name,
        email : email,
        password : password,
        image : image
     });
    return await newUser.save();
};

const isValidName = (name) => {
    const allowedChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 0; i < name.length; i++) {
        if (!allowedChars.includes(name[i])) return false;
    }
    return true;
};

const getUserById = async (id) =>{ return await User.findOne({id : id})};

const getUserByUsername = async(email) => { return await User.findOne({email : email})};

module.exports = {createUser,isValidName,getUserById,getUserByUsername}