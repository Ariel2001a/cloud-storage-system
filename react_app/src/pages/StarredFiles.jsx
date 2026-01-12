import { useState, useEffect } from "react";
import { getStarredFiles } from "../api/files";
import FileItem from "../components/FileItem";
import FileView from "./FileView"; // 1. ייבוא של קומפוננטת התצוגה
import { useNavigate } from "react-router-dom";
import "./Home.css";
import { FileRightClickMenu } from "../components/FileRightClickMenu"; // אם עדיין לא ייבאת
import { useLang } from "../context/LangContext";

export default function StarredFiles() {
    const [items, setItems] = useState([]);
    const { lang, setLang, isRtl } = useLang();
    

    const [menu, setMenu] = useState({
        visible: false,
        x: 0,
        y: 0,
        file: null
    });

    // 2. State חדש: האם יש קובץ שנבחר לצפייה?
    const [selectedFile, setSelectedFile] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        async function load() {
            try {
                const res = await getStarredFiles();
                setItems(res || []);
            } catch (error) {
                console.error("Error loading files:", error);
            }
        }
        load();
    }, []);

    function handleRightClick(e, file) {
        e.preventDefault(); // חשוב! מונע את התפריט ברירת המחדל של הדפדפן
        setMenu({
            visible: true,
            x: e.clientX,
            y: e.clientY,
            file
        });
    };

    // 3. עדכון פונקציית הפתיחה
    function openItem(item) {
        if (item.type === "folder") {
            navigate(`/folder/${item.id}`); // תיקייה עדיין עוברת עמוד
        } else {
            setSelectedFile(item); // קובץ נשמר ב-State ופותח מודאל
        }
    }

    return (
        <div className="page-container">
            <h2 className="page-title">
                {isRtl ? "מסומנים בכוכב" : "Starred"}
            </h2>

            <div className="file-list">
                {items.length > 0 ? (
                    items.map(item => (
                        <FileItem
                            key={item.id}
                            item={item}
                            onClick={() => openItem(item)}
                            onRightClick={handleRightClick}
                        />
                    ))
                ) : (
                    <p className="status-msg">
                        {isRtl ? "אין קבצים להצגה" : "No files to show"}
                    </p>
                )}
            </div>

            <FileRightClickMenu menu={menu} setMenu={setMenu} items={items} setItems={setItems} />

            {/* 4. הצגת המודאל הצף אם selectedFile אינו null */}
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