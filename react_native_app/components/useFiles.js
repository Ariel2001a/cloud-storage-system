import { useState, useEffect, useRef } from 'react';
import { DeviceEventEmitter } from 'react-native';
import { getFiles, getFolderChildren, getFileContent, searchFiles } from '../api/files';

export function useFiles() {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [folderStack, setFolderStack] = useState([]);
    const currentFolder = folderStack[folderStack.length - 1] || null;
    const [selectedFile, setSelectedFile] = useState(null);
    const [isFileModalVisible, setIsFileModalVisible] = useState(false);

    const currentFolderRef = useRef(currentFolder);
    useEffect(() => { currentFolderRef.current = currentFolder; }, [currentFolder]);

    const handleSearch = async (query) => {
        if (!query.trim()) {
            fetchFiles();
            return;
        }
        setLoading(true);
        try {
            const results = await searchFiles(query);
            setFiles(results);
        } catch (error) {
            console.error("Search error:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchFiles = async (folder = currentFolderRef.current) => {
        setLoading(true);
        try {
            const data = folder ? await getFolderChildren(folder.id) : await getFiles();
            setFiles(data);
        } catch (error) { console.error(error); } finally { setLoading(false); }
    };

    useEffect(() => {
        const sub = DeviceEventEmitter.addListener("REFRESH_FILES", fetchFiles);
        const searchSub = DeviceEventEmitter.addListener("SEARCH_FILES", handleSearch);
        return () => {
            sub.remove();
            searchSub.remove();
        };
    }, []);

    useEffect(() => {
        DeviceEventEmitter.emit('SET_PARENT_ID', currentFolder?.id || null);
        fetchFiles();
    }, [currentFolder]);

    const navigateInto = (item) => {
        if (item.type === 'folder') setFolderStack(prev => [...prev, item]);
        else openFile(item);
    };

    const navigateBack = () => setFolderStack(prev => prev.slice(0, -1));

    const openFile = async (item) => {
        setSelectedFile({ ...item, content: '' });
        setIsFileModalVisible(true);
        const content = await getFileContent(item.id);
        setSelectedFile(prev => ({ ...prev, content }));
    };

    return {
        files, loading, currentFolder, folderStack, selectedFile,
        isFileModalVisible, setIsFileModalVisible, navigateInto, navigateBack, fetchFiles
    };
}