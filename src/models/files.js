const userFiles = {}; // store files/folders for each user (key = userId)
const deletedUserFiles = {}; // store deleted files/folders for each user (key = userId)
const sharedFiles = {}; // store shared files/folders for each user (key = userId)

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const DAKA = 2 * 60 * 1000;

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

const getUserRecentFiles = (userId) => {
    files = getUserFiles(userId);
    return files.filter((item => Date.now() - item.date <= DAKA))       // return user's recent files
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

const getStarredFiles = (userId) => {
    const files = getUserFiles(userId);
    return files.filter(item => item.starred === true);
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

const deleteFileByIdFromSharedFiles = (user_id, id) => {
    let file = getFileByIdFromShared(user_id, id);
    if (file) {
        sharedFiles[user_id] = sharedFiles[user_id].filter(a => a.id !== id);
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

const RestoreFileByIdFromBin = (user_id, id) => {
    let file = getFileByIdFromDeleted(user_id, id);

    if (file) {
        deletedUserFiles[user_id] = deletedUserFiles[user_id].filter(a => a.id !== id);
        userFiles[user_id].push(file);
        return true;
    }

    return false;
};

const starOrUnstarFile = (userId, fileId) => {
    const file = getFileById(userId, fileId);
    if (file) {
        file.starred = !file.starred;
        return true;
    }
    return false;
};

const getFolderFiles = (userId, folderParent) => {
    const allFiles = getUserFiles(userId);
    const filesInFolder = allFiles.filter(item => item.folderParent == folderParent);
    return filesInFolder;
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

const doFilePublic = (userId, fileId) => {
    const file = getFileById(userId, fileId);
    if (file) {
        file.pub =true;
        return true;
    }
    return false;
};


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
    getFileByIdFromShared,
    getStarredFiles,
    RestoreFileByIdFromBin,
    getUserRecentFiles,
    doFilePublic,
    deleteFileByIdFromSharedFiles
};


