import React, { useState, useEffect, useRef } from "react";
import "./fileItem.css";
import { EmailPromptModal } from "./emailPrompt.jsx";
import {
  renameFileOrFolder,
  deleteFileOrFolder,
  shareFileOrFolder,
  moveFolder,
  restoreFileOrFolder,
  starOrUnstarFileOrPublic
} from "../api/files.js";
import { MoveFolderModal } from "./MoveFolderModal";

// פונקציה כללית לטיפול בפעולות קבצים
const handleFileAction = async (apiFunc, file, setItems, setMenu, ...args) => {
  const isStarredPage = window.location.pathname.includes("starred");

  const stateUpdaters = {
    renameFileOrFolder: (prevItems) => {
      const newName = args[0];
      return prevItems.map(f => f.id === file.id ? { ...f, name: newName } : f);
    },
    starOrUnstarFileOrPublic: (prevItems) => {
      if (isStarredPage) {
        return prevItems.filter(f => f.id !== file.id); // הסרה מהעמוד Starred
      } else {
        return prevItems.map(f =>
          f.id === file.id ? { ...f, starred: !f.starred } : f
        );
      }
    },
    deleteFileOrFolder: (prevItems) => prevItems.filter(f => f.id !== file.id),
    restoreFileOrFolder: (prevItems) => prevItems.filter(f => f.id !== file.id),
  };

  try {
    await apiFunc(file.id, ...args);

    const updater = stateUpdaters[apiFunc.name];
    if (updater) {
      setItems(prevItems => updater(prevItems));
    }

    setMenu(prev => ({ ...prev, visible: false }));
  } catch (err) {
    console.error(err);
    alert("Action failed: " + err.message);
  }
};

export function FileRightClickMenu({ menu, setMenu, items, setItems, lang, isRTL }) {
  const [showEmailPrompt, setShowEmailPrompt] = useState(false);
  const [fileToShare, setFileToShare] = useState(null);
  const [moveFolderOpen, setMoveFolderOpen] = useState(false);
  const [fileToMove, setFileToMove] = useState(null);
  const menuRef = useRef(null);

  const closeMenu = () => setMenu(prev => ({ ...prev, visible: false }));

  // סגירה בלחיצה מחוץ לתפריט
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
    setFileToMove(file);
    setMoveFolderOpen(true);
  };

  // 🌟 משתמשים ב־items מה־state כדי לעדכן Starred מיד
  const isStarred = items.find(f => f.id === file.id)?.starred ?? file.starred;

  return (
    <ul
      ref={menuRef}
      className="file-right-click-menu"
      style={{ top: menu.y, left: menu.x, position: "absolute", zIndex: 1000 }}
    >
      {!isBinPage && (
        <ul>
          <li
            onClick={async () => {
              const newName = prompt(isRTL ? "שם חדש:" : "New name:");
              if (newName !== null && newName.trim() !== "") {
                await handleFileAction(renameFileOrFolder, file, setItems, setMenu, newName);
              }
              closeMenu();
            }}
          >
            {isRTL ? "שינוי שם" : "Rename"}
          </li>

          <li
            onClick={async () => {
              await handleFileAction(starOrUnstarFileOrPublic, file, setItems, setMenu, "star");
              closeMenu();
            }}
          >
            {isRTL
              ? (isStarred ? "הסרה מפריטים המסומנים בכוכב" : "הוספה לפריטים המסומנים בכוכב")
              : (isStarred ? "Remove from Starred" : "Add to Starred")}
          </li>

          <li onClick={handleShareClick}>{isRTL ? "שיתוף" : "Share"}</li>

          <li onClick={() => handleMoveFolderClick(file)}>{isRTL ? "העברת תיקייה" : "Move Folder"}</li>

          <li
            onClick={async () => {
              await handleFileAction(deleteFileOrFolder, file, setItems, setMenu);
              closeMenu();
            }}
          >
            {isRTL ? "העברה לאשפה" : "Move to bin"}
          </li>
        </ul>
      )}

      {isBinPage && (
        <ul>
          <li
            onClick={async () => {
              await handleFileAction(restoreFileOrFolder, file, setItems, setMenu);
              closeMenu();
            }}
          >
            {isRTL ? "שחזור" : "Restore"}
          </li>
          <li
            onClick={async () => {
              await handleFileAction(deleteFileOrFolder, file, setItems, setMenu);
              closeMenu();
            }}
          >
            {isRTL ? "מחיקה לצמיתות" : "Delete Forever"}
          </li>
        </ul>
      )}

      {showEmailPrompt && fileToShare && (
        <EmailPromptModal
          file={fileToShare}
          isRtl={isRTL}
          onSubmit={handleEmailSubmit}
          onCancel={() => setShowEmailPrompt(false)}
        />
      )}

      {moveFolderOpen && fileToMove && (
        <MoveFolderModal
          startFolderId={null} // תיקייה ראשית
          lang={lang}
          isRtl={isRTL}
          file={fileToMove}
          onClose={() => setMoveFolderOpen(false)}
          onMoveConfirm={async (targetFolderId) => {
            try {
              await moveFolder(fileToMove.id, targetFolderId);
              setMoveFolderOpen(false);

              // עדכון ה-state אחרי העברה
              setItems(prev => prev.filter(f => f.id !== fileToMove.id));
            } catch (err) {
              console.error(err);
              alert(err.message);
            }
          }}
        />
      )}
    </ul>
  );
}
