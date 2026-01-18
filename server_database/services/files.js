const File = require ('../models/files');
const Permissions = require ('../models/permission')
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

const getUserFilesByFilter = async (userId, filter = {}) => {
  return await File.find({ ownerId: userId, ...filter }) || [];
};

// Get all files/folders for a user
const getUserFiles = async(userId) => {
    return await getUserFilesByFilter(userId);
};

// Get all files/folders for a user
const getUserDeletedFiles = async(userId) => {
    return await getUserFilesByFilter(userId, {bin : true});
};

const getUserRecentFiles = async (userId) => {
    const oneWeekAgo = new Date(Date.now() - WEEK_MS);
    return await getUserFilesByFilter( userId , { date: { $gte: oneWeekAgo } });
};

// Get all files/folders for a user
const getTopLevelFiles = async(userId) => {
    return await getUserFilesByFilter(userId, {folderParent : null});
};

const getFolderFiles = async (userId, folderParent) => {
    return await getUserFilesByFilter(userId, {folderParent : folderParent});
};

// Get all files/folders for a user
const getStarredFiles = async(userId) => {
    return await getUserFilesByFilter(userId, {starred : true});
};

const getFilesSharedWithUser = async (userId) => {
  const userPermissions = await Permissions.find({
    userId,
    permission: { $ne: 'owner' }
  });

  const fileIds = userPermissions.map(p => p.fileId);

  return await File.find({
    id : { $in: fileIds },
    ownerId: { $ne: userId }
  });
};

const addFileOrFolder = async (userId, fileData) => {
  const newFile = new File({
    ownerId: userId,
    name: fileData.name,
    type: fileData.type,
    date: fileData.date || Date.now(),
    size: fileData.size || 0,
    folderParent: fileData.folderParent || null,
    path: fileData.path || null
  });

  return await newFile.save();
};



const getFileById = async (userId, fileId) => {
    const files = await getUserFilesByFilter(userId, { id: fileId});
    return files[0] || null;
};


const getFileByIdFromDeleted = async (userId, fileId) => {
    const files = await getUserFilesByFilter(userId, { id: fileId, bin: true });
    return files[0] || null;
};


const getFileByIdFromShared = async (userId, fileId) => {
    const files = await getFilesSharedWithUser(userId);
    if (!files || files.length === 0 ) {
        return null;
    }
    return files.find(f => f.id === fileId) || null;
};

// Deletes a file/folder by its ID for a given user
const deleteFileByIdFromUserFiles = async (userId, fileId) => {
    let file = await getFileById(userId, fileId);
    if (!file) {
        return false;
    }
    file.bin = true;
    await file.save();
    return true;
};

const RestoreFileByIdFromBin = async (userId, fileId) => {
    let file = await getFileByIdFromDeleted(userId, fileId);
    if (!file) {
        return false;
    }
    file.bin = false;
    await file.save();
    return true;
};

const deleteFileByIdFromBin = async(userId, fileId) => {
    let file = await getFileByIdFromDeleted(userId, fileId);
    if (!file) {
        return false;
    }

    await file.remove();
    return true;
};

const starOrUnstarFile = async (userId, fileId) => {
    let file = await getFileById (userId, fileId);
    if (!file) {
        return false;
    }
    file.starred = !file.starred;
    await file.save();
    return true;
};


const doFilePublic = async (userId, fileId) => {
    let file = await getFileById (userId, fileId);
    if (!file) {
        return false;
    }
    file.pub = true;
    await file.save();
    return true;
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
    getFileByIdFromShared,
    getStarredFiles,
    RestoreFileByIdFromBin,
    getUserRecentFiles,
    doFilePublic
};