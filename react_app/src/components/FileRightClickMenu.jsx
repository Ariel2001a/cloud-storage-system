import React from "react";
import { useState, useEffect,useRef } from "react";
import "./fileItem.css";
import { EmailPromptModal } from "./emailPrompt.jsx";
import {renameFileOrFolder, deleteFileOrFolder, shareFileOrFolder, moveFolder,starOrUnstarFile, restoreFileOrFolder} from "../api/files.js";
import { MoveFolderModal } from "./MoveFolderModal";

const handleFileAction = async (apiFunc, file, setItems, setMenu, ...args) => {
    
      const isStarredPage = window.location.pathname.includes("starred");

    // מפת עדכון state לפי פונקציית API
    const stateUpdaters = {
        renameFileOrFolder: (prevItems) => {
            const newName = args[0];
            return prevItems.map(f => f.id === file.id ? { ...f, name: newName } : f);
        },
        starOrUnstarFile: (prevItems) => {
            if (isStarredPage) {
                return prevItems.filter(f => f.id !== file.id);
            } else {
                   return prevItems.map(f =>
                        f.id === file.id ? { ...f, starred: !f.starred } : f
                    )
            }
        },
        deleteFileOrFolder: (prevItems) => {
            return prevItems.filter(f => f.id !== file.id);
        },

        restoreFileOrFolder: (prevItems) => {
            return prevItems.filter(f => f.id !== file.id);
        }



        // אפשר להוסיף פה גם Move או Share אם רוצים
    };
    
    try {
        await apiFunc(file.id, ...args);

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


export function FileRightClickMenu({ menu, setMenu, items, setItems, lang  }) {
  const [showEmailPrompt, setShowEmailPrompt] = useState(false);
  const [fileToShare, setFileToShare] = useState(null);
  const [moveFolderOpen, setMoveFolderOpen] = useState(false);
    const [folderToMove, setFolderToMove] = useState(null);
    const menuRef = useRef(null)

    const closeMenu = () => setMenu(prev => ({ ...prev, visible: false }));


          // ✨ כאן ההוספה: סגירה בלחיצה מחוץ לתפריט
    useEffect(() => {
        const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            closeMenu();
        }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);



  if (!menu.visible || !menu.file) return null;

  const isBinPage = window.location.pathname.includes("deleted");
  const isStarredPage = window.location.pathname.includes("starred");
  


  const file = menu.file;

  const handleShareClick = () => {
        setFileToShare(file);
        setShowEmailPrompt(true);
   };
    const handleEmailSubmit = async (email, permission) => {
        if (!fileToShare) return;

        await handleFileAction(
            shareFileOrFolder,
            fileToShare,
            setItems,
            setMenu,
            email,
            permission
        );

        setShowEmailPrompt(false);
        setFileToShare(null);
        closeMenu();
    };

    const handleMoveFolderClick = (file) => {
        setFolderToMove(file);
        setMoveFolderOpen(true);
    };

  return (
    <ul
        ref={menuRef} 
      className="file-right-click-menu"
      style={{ top: menu.y, left: menu.x, position: "absolute", zIndex: 1000 }}
    >
      {!isBinPage &&(
        <ul>
        <li onClick={async () => { const newName = prompt("New name:");
                    if (newName !== null && newName.trim() !== ""){
                        await handleFileAction(renameFileOrFolder, file, setItems, setMenu, newName);} closeMenu(); }}>Rename</li>
        <li onClick={async() => { await handleFileAction(starOrUnstarFile, file, setItems, setMenu); closeMenu(); }}>
            {file.starred ? "Unstar" : "Star"}
        </li>
        <li onClick={handleShareClick}>Share</li>

        <li onClick={() => handleMoveFolderClick(file)}>Move Folder</li>

        <li onClick={async () => { await handleFileAction(deleteFileOrFolder, file, setItems, setMenu); closeMenu(); }}>Delete</li>
            
      </ul>
      )}

        {isBinPage && (
            <ul>
            <li onClick={async () => {await handleFileAction(restoreFileOrFolder, file, setItems, setMenu); closeMenu();}}>
                Restore</li>
            <li onClick={async () => {await handleFileAction(deleteFileOrFolder, file, setItems, setMenu); closeMenu();}}>
                Delete Forever</li>
            </ul>
        )}     
        
        {showEmailPrompt && fileToShare && (
        <EmailPromptModal
          file={fileToShare}
          onSubmit={handleEmailSubmit}
          onCancel={() => setShowEmailPrompt(false)}
        />
      )}

        {moveFolderOpen && folderToMove && (
            <MoveFolderModal
                startFolderId={null} // תיקייה ראשית
                lang={lang}
                onClose={() => setMoveFolderOpen(false)}
                onMoveConfirm={async (targetFolderId) => {
                    try {
                        await moveFolder(folderToMove.id, targetFolderId); // parent_id = targetFolderId
                        setMoveFolderOpen(false);

                        // עדכון ה-state אחרי העברה
                        setItems(prev => prev.filter(f => f.id !== folderToMove.id));
                    } catch (err) {
                        console.error(err);
                        alert(err.message); // יציג את השגיאה מה-API אם יש
                    }
                }}

            />
        )}
    </ul>
     );
    


}
