import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getFolderChildren } from "../api/files";
import FileItem from "../components/FileItem";
import FileView from "./FileView";
import "./Home.css"; // שימוש באותו עיצוב של דף הבית

export default function FolderView({ lang, onFolderEnter }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const isRtl = lang === "he";

    useEffect(() => {
        onFolderEnter(id); // מעדכן את ה-Layout שאנחנו בתוך תיקייה
        async function load() {
            const children = await getFolderChildren(1, id);
            setItems(children || []);
        }
        load();
        return () => onFolderEnter(null);
    }, [id]);

    return (
        /* אנחנו משתמשים ב-ClassNames שהגדרנו ב-Home.css */
        <div className="page-container">
            <header className="folder-header-row" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <button className="back-btn" onClick={() => navigate(-1)} style={{ cursor: 'pointer' }}>
                    {isRtl ? "→" : "←"}
                </button>
                <h2 className="page-title">{isRtl ? "תיקייה" : "Folder"}</h2>
            </header>

            <div className="file-list">
                {items.length > 0 ? (
                    items.map(item => (
                        <FileItem
                            key={item.id}
                            item={item}
                            onClick={(it) => it.type === "folder" ? navigate(`/folder/${it.id}`) : setSelectedFile(it)}
                        />
                    ))
                ) : (
                    <p className="status-msg">{isRtl ? "התיקייה ריקה" : "Folder is empty"}</p>
                )}
            </div>

            {selectedFile && (
                <FileView
                    fileId={selectedFile.id}
                    fileName={selectedFile.name}
                    lang={lang}
                    onClose={() => setSelectedFile(null)}
                />
            )}
        </div>
    );
}