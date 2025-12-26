const userFiles = {}; // store files/folders for each user (key = userId)

// Get all files/folders for a user
const getUserFiles = (userId) => {
    if (!userFiles[userId]) {       // if user has no files yet, create empty array
        userFiles[userId] = [];
    }
    return userFiles[userId];       // return user's files
};


// Add a new file or folder for a user
const addFileOrFolder = (userId, file) => {
    if (!userFiles[userId]) userFiles[userId] = [];
        userFiles[userId].push(file);
};


// Get only top-level files/folders (no parent)
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
