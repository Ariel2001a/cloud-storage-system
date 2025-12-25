const userFiles = {};

const getUserFiles = (userId) => {
    if (!userFiles[userId]) {
        userFiles[userId] = [];
    }
    return userFiles[userId];
};

const addFileOrFolder = (userId, file) => {
    if (!userFiles[userId]) userFiles[userId] = [];
        userFiles[userId].push(file);
};

const getTopLevelFiles = (userId) => {
    const files = getUserFiles(userId);
    return files.filter(item => item.folderParent == null);
};

const getFileById = (user_id,id) =>  userFiles[user_id].find(f => f.id===id)

const deleteFileById = (user_id, id) => {
    userFiles[user_id] = userFiles[user_id].filter(a => a.id !== id);
    return true;
};

const getFolderFiles = (userId, folderParent) => {
    let files = getUserFiles(userId);
    files = files.filter(item => item.folderParent == folderParent);
    const id_files_in_folder = []
    files.forEach(file => {
        id_files_in_folder.push(file.id)
    });

    return id_files_in_folder
};

module.exports = {
    getUserFiles,
    addFileOrFolder,
    getTopLevelFiles,
    getFileById,
    deleteFileById,
    getFolderFiles
};
