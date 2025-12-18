let idUsersCounter = 0
const users =[]

const createUser = (first_name,last_name,email,password,image) => {
    const newUser = { id: ++idUsersCounter,first_name,last_name,email,password,image}
    users.push(newUser)
    return newUser
}

module.exports = {
    createUser
}