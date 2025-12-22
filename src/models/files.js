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

module.exports = {
    getUserFiles,
    addFileOrFolder,
    getTopLevelFiles
};
