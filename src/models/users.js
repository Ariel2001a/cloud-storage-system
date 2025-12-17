let idUsersCounter = 0
const users =[]

/*
const getAllArticles = () => articles


const getArticle = (id) =>  articles.find(a => a.id===id)
*/
const createUser = (first_name,last_name,email,password,image) => {
    const newUser = { id: ++idUsersCounter,first_name,last_name,email,password,image}
    users.push(newUser)
    return newUser
}
/*
const deleteArticle = (id) => {
    const filtered = articles.filter(a => a.id !== id)
    articles.length = 0
    articles.push(...filtered)
    return true;
};

*/

module.exports = {
    createUser
}