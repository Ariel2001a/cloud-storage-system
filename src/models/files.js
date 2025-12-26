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
    const files = getUserFiles(userId); // get user's files
    files.push(file);                   // add new file/folder
};

// Get only top-level files/folders (no parent)
const getTopLevelFiles = (userId) => {
    const files = getUserFiles(userId);         // get all user's files
    return files.filter(item => !item.parentId && !item.folderId); // filter top-level only
};

const getFileById = (user_id,id) =>  userFiles[user_id].find(f => f.id===id)


module.exports = {
    getFileById,
    getUserFiles,        // export function to get user's files
    addFileOrFolder,     // export function to add file/folder
    getTopLevelFiles     // export function to get top-level files
};
