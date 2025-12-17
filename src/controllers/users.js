const User = require('../models/users')
/*
exports.getAllArticles = (req, res) => {
    res.json(Article.getAllArticles())
}

exports.getArticleById = (req, res) => {
    const article = Article.getArticle(parseInt(req.params.id))
    if (!article)
    return res.status (404).json({ error: 'Article not found' })
    res.json(article)
}
*/
exports.createUser = (req, res) => {
    const { first_name,last_name,email,password,image } = req.body
    const profileImage = image || 'default.png';
    if (!first_name || !last_name || !email || !password)
        return res.status(400).json({ error: 'Missing required fields' })
    const newUser = User.createUser(first_name,last_name,email,password,profileImage)
    res.status(201).location(`/api/users/${newUser.id}`).json({ id: newUser.id })
}
/*
exports.updateArticleById = (req, res) => {
    let update = false
    const article = Article.getArticle(parseInt(req.params.id))
    if (!article)
        return res.status (404).json({ error: 'Article not found' })
    const {title,content} = req.body
    if(title != null){
        article.title = title
        update = true
    }
    if(content!=null){
        article.content = content
        update = true
    }
    if(update)
        return res.status (204).end()

    return res.status (400).json({ error: 'Title or content required' })

}

exports.updateAllArticleById = (req, res) => {
    const article = Article.getArticle(parseInt(req.params.id))
    if (!article)
        return res.status (404).json({ error: 'Article not found' })
    const {title,content} = req.body
    if(title != null & content != null)
    {
        article.title = title
        article.content = content
        return res.status (204).end()
    }

   return res.status (400).json({ error: 'Title and content required' })
}

exports.deleteArticleById = (req,res) =>{
    const idToDelete = parseInt(req.params.id);
    const article = Article.getArticle(idToDelete);
    if (!article) return res.status(404).json({ error: 'Article not found' });

    Article.deleteArticle(idToDelete);
    return res.status(204).end(); 
}
*/