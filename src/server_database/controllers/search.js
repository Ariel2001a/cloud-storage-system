const searchServices = require ('../services/search');
const User = require ('../services/user');

exports.getFilesByQuery = async (req, res) => {
    const userId = req.userId;

    if (!userId) return res.status(401).json({ error: 'User not logged in' });

    const user = await User.getUserById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const query = req.params.query

    const files = await searchServices.getFilesByQuery(userId,query);
    res.json({ files });
};