let idUsersCounter = 0
const users =[]

const createUser = (first_name,last_name,email,password,image) => {
    const newUser = { id: ++idUsersCounter,first_name,last_name,email,password,image}
    users.push(newUser)
    return newUser
}

const isValidName = (name) => {
    const allowedChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 0; i < name.length; i++) {
        if (!allowedChars.includes(name[i])) {
            return false;
        }
    }
    return true;
}

const getUserById = (id) =>  users.find(u => u.id===id)

const checkUserByUsername = (email) =>  users.find(u => u.email===email)


module.exports = {
    createUser,
    isValidName,
    getUserById,
    checkUserByUsername
}