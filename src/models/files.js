const userFiles = {}; // store files/folders for each user (key = userId)
const deletedUserFiles = {}; // store deleted files/folders for each user (key = userId)
const sharedFiles = {}; // store shared files/folders for each user (key = userId)

// Get all files/folders for a user
const getUserFiles = (userId) => {
    if (!userFiles[userId]) {       // if user has no files yet, create empty array
        userFiles[userId] = [];
    }
    return userFiles[userId];       // return user's files
};


const getUserDeletedFiles = (userId) => {
    if (!deletedUserFiles[userId]) {       // if user has no deleted files yet, create empty array
        deletedUserFiles[userId] = [];
    }
    return deletedUserFiles[userId];       // return user's deleted files
};

const getUserSharedFiles = (userId) => {
    if (!sharedFiles[userId]) {       // if user has no shared files yet, create empty array
        sharedFiles[userId] = [];
    }
    return sharedFiles[userId];       // return user's shared files
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
const getFileById = (user_id, id) => {
  const files = getUserFiles(user_id);
  if (!files) {
    return null;
  }
  return files.find(f => f.id === id) || null;
};

const getFileByIdFromDeleted = (user_id, id) => {
  const files = deletedUserFiles[user_id];
  if (!files) {
    return null;
  }
  return files.find(f => f.id === id) || null;
};


const getFileByIdFromShared = (user_id, id) => {
  const files = getUserSharedFiles(user_id);
  if (!files) {
    return null;
  }
  return files.find(f => f.id === id) || null;
};

// Deletes a file/folder by its ID for a given user
const deleteFileByIdFromUserFiles = (user_id, id) => {
    let file = getFileById(user_id, id);
    if (file) {
        userFiles[user_id] = userFiles[user_id].filter(a => a.id !== id);
        deletedUserFiles[user_id] = deletedUserFiles[user_id] || [];
        deletedUserFiles[user_id].push(file);
        return true;
    }
    return false;
};

const deleteFileByIdFromBin = (user_id, id) => {
    let file = getFileByIdFromDeleted(user_id, id);

    if (file) {
        deletedUserFiles[user_id] = deletedUserFiles[user_id].filter(a => a.id !== id);
        return true;
    }

    return false;

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

const starOrUnstarFile = (userId, fileId) => {
    const file = getFileById(userId, fileId);
    if (file) {
        file.starred = !file.starred;
        return true;
    }
    return false;
};

const sharedWithUsers = (userId, fileId,userToShareId) => {
    const files = getUserFiles(userId);
    const file = files.find(f => f.id === fileId);
    if (file) {
        let sharedFile = getFileByIdFromShared(userToShareId, fileId);
        if (!sharedFile) {
            sharedFiles[userToShareId].push(file);
        }
        return true;
    }

    return false;
}

module.exports = {
    getUserFiles,
    addFileOrFolder,
    getTopLevelFiles,
    getFileById,
    getFolderFiles,
    starOrUnstarFile,
    getUserDeletedFiles,
    deleteFileByIdFromUserFiles,
    deleteFileByIdFromBin,
    getFileByIdFromDeleted,
    sharedWithUsers,
    getUserSharedFiles,
    getFileByIdFromShared
};
