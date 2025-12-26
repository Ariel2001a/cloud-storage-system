const userFiles = {};

// Returns all files/folders for a given user, initializing if none exist
const getUserFiles = (userId) => {
    if (!userFiles[userId]) {
        userFiles[userId] = [];
    }
    return userFiles[userId];
};

// Adds a file or folder to the user's collection
const addFileOrFolder = (userId, file) => {
    if (!userFiles[userId]) userFiles[userId] = [];
        userFiles[userId].push(file);
};

// Returns only the top-level files/folders (no parent folder)
const getTopLevelFiles = (userId) => {
    const files = getUserFiles(userId);
    return files.filter(item => item.folderParent == null);
};

// Returns a file/folder by its ID for a given user
const getFileById = (user_id,id) =>  userFiles[user_id].find(f => f.id===id)

// Deletes a file/folder by its ID for a given user
const deleteFileById = (user_id, id) => {
    userFiles[user_id] = userFiles[user_id].filter(a => a.id !== id);
    return true;
};

// Returns IDs of all files contained in a specific folder for a user
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
