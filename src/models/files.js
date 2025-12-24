const userFiles = {};

const getUserFiles = (userId) => {
    if (!userFiles[userId]) {
        userFiles[userId] = [];
    }
    return userFiles[userId];
};

const addFileOrFolder = (userId, file) => {
    const files = getUserFiles(userId);
    files.push(file);
};

const getTopLevelFiles = (userId) => {
    const files = getUserFiles(userId);
    return files.filter(item => !item.parentId && !item.folderId);
};

const getFileById = (user_id,id) =>  userFiles[user_id].find(f => f.id===id)


module.exports = {
    getUserFiles,
    addFileOrFolder,
    getTopLevelFiles,
    getFileById
};
