import React from "react";
import "./fileItem.css";
import {renameFileOrFolder, deleteFileOrFolder, shareFileOrFolder, moveFolder,starOrUnstarFile} from "../api/files.js";

const refreshPage = async (newName, file, setItems, setMenu) => {
    if (!newName) return;

    try {
        await renameFileOrFolder(1, file.id, newName);

        // עדכון ה-state המקומי
        setItems(prevItems =>
            prevItems.map(f => f.id === file.id ? { ...f, name: newName } : f)
        );

        setMenu(prev => ({ ...prev, visible: false }));
    } catch (err) {
        console.error(err);
        alert("Failed to rename file");
    }
};

const handleFileAction = async (apiFunc, file, setItems, setMenu, ...args) => {
    // מפת עדכון state לפי פונקציית API
    const stateUpdaters = {
        renameFileOrFolder: (prevItems) => {
            const newName = args[0];
            return prevItems.map(f => f.id === file.id ? { ...f, name: newName } : f);
        },
        starOrUnstarFile: (prevItems) => {
            return prevItems.map(f => f.id === file.id ? { ...f, starred: !f.starred } : f);
        },
        deleteFileOrFolder: (prevItems) => {
            return prevItems.filter(f => f.id !== file.id);
        },
        // אפשר להוסיף פה גם Move או Share אם רוצים
    };

    try {
        await apiFunc(1, file.id, ...args);

        // עדכון ה-state בהתאם לפונקציה
        const updater = stateUpdaters[apiFunc.name];
        if (updater) {
            setItems(prevItems => updater(prevItems));
        }

        // סוגר את התפריט
        setMenu(prev => ({ ...prev, visible: false }));
    } catch (err) {
        console.error(err);
        alert("Action failed: " + err.message);
    }
};


export function FileRightClickMenu({ menu, setMenu, items, setItems }) {
  if (!menu.visible || !menu.file) return null;

  const closeMenu = () => setMenu(prev => ({ ...prev, visible: false }));
  const file = menu.file;

  return (
    <ul
      className="file-right-click-menu"
      style={{ top: menu.y, left: menu.x, position: "absolute", zIndex: 1000 }}
    >
      <li onClick={async () => { const newName = prompt("New name:");
                    await handleFileAction(renameFileOrFolder, file, setItems, setMenu, newName); closeMenu(); }}>Rename</li>
      <li onClick={async() => { await handleFileAction(starOrUnstarFile, file, setItems, setMenu); closeMenu(); }}>
        {file.starred ? "Unstar" : "Star"}
      </li>
      <li onClick={async () => { await handleFileAction(deleteFileOrFolder, file, setItems, setMenu); closeMenu(); }}>Delete</li>
      <li onClick={async () => { const sharedWithUserId = prompt("User ID to share with:");
                                 const permission = prompt("Permission (read/write):");
                                 await handleFileAction(shareFileOrFolder, file, setItems, setMenu, sharedWithUserId, permission); 
                                 closeMenu(); }}>Share</li>
      <li onClick={async () => { const folderId = prompt("Folder ID to move to:");
                                 await handleFileAction(moveFolder, file, setItems, setMenu, folderId); closeMenu(); }}>Move to folder</li>
    </ul>
  );
}
