import { useState, useEffect } from "react";
import { getFolderChildren, getFiles } from "../api/files";
import FileItem from "./FileItem";
import "./modalMoveToFolder.css";

export function MoveFolderModal({ startFolderId = null, onClose, onMoveConfirm, lang }) {
    const [currentFolderId, setCurrentFolderId] = useState(startFolderId);
    const [items, setItems] = useState([]);
    const [folderStack, setFolderStack] = useState([startFolderId]);
    const [selectedFolderId, setSelectedFolderId] = useState(null); // התיקייה שנבחרה

    const isRtl = lang === "he";

    // טען תוכן תיקייה
    useEffect(() => {
        async function load() {
            try {
                let children;
                if (currentFolderId === null) {
                    children = await getFiles(1); // תיקייה ראשית
                } else {
                    children = await getFolderChildren(1, currentFolderId);
                }
                // רק תיקיות
                setItems((children || []).filter(item => item.type === "folder"));
            } catch (err) {
                console.error("Failed to load folder children:", err);
                setItems([]);
            }
        }
        load();
    }, [currentFolderId]);

    // כניסה לתיקייה פנימית
    const handleFolderClick = (folder) => {
        setCurrentFolderId(folder.id);
        setFolderStack(prev => [...prev, folder.id]);
    };

    // כפתור Back
    const handleBack = () => {
        if (folderStack.length > 1) {
            const newStack = [...folderStack];
            newStack.pop();
            const prevFolderId = newStack[newStack.length - 1];
            setFolderStack(newStack);
            setCurrentFolderId(prevFolderId);
        } else {
            onClose();
        }
    };

    // בחירת תיקייה
    const handleSelectFolder = (folderId) => {
        setSelectedFolderId(folderId);
    };

    // כפתור Confirm Move
    const handleConfirm = () => {
        if (selectedFolderId === null) {
            alert(isRtl ? "אנא בחר תיקייה" : "Please select a folder");
            return;
        }
        onMoveConfirm(selectedFolderId);
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <header className="folder-header-row" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <button className="back-btn" onClick={handleBack} style={{ cursor: 'pointer' }}>
                        {isRtl ? "→" : "←"}
                    </button>
                    <h2 className="page-title">
                        {currentFolderId === null ? (isRtl ? "תיקייה ראשית" : "Root") : (isRtl ? "תיקייה" : "Folder")}
                    </h2>
                </header>

                    <div className="file-list">
                        {items.length > 0 ? (
                            items.map(item => (
                                <div
                                    key={item.id}
                                    style={{
                                        padding: '5px 10px',
                                        cursor: 'pointer',
                                        backgroundColor: selectedFolderId === item.id ? '#cce5ff' : 'transparent',
                                        borderRadius: '5px',
                                        marginBottom: '3px',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}
                                >
                                    {/* שם התיקייה – Single Click לבחירה */}
                                    <span onClick={() => handleSelectFolder(item.id)}>
                                        {item.name}
                                    </span>

                                    {/* כפתור כניסה פנימית */}
                                    <button
                                        onClick={() => handleFolderClick(item)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {isRtl ? "→" : "→"}
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="status-msg">{isRtl ? "התיקייה ריקה" : "Folder is empty"}</p>
                        )}
                    </div>

                <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <button onClick={onClose}>{isRtl ? "ביטול" : "Cancel"}</button>
                    <button onClick={handleConfirm}>{isRtl ? "אשר העברה" : "Confirm Move"}</button>
                </div>
            </div>
        </div>
    );
}
