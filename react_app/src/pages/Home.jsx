import { useState, useEffect } from "react";
import { getFiles } from "../api/files";
import FileItem from "../components/FileItem";
import FileView from "./FileView"; // 1. ייבוא של קומפוננטת התצוגה
import { useNavigate } from "react-router-dom";
import "./Home.css";

export default function Home({ lang }) {
    const [items, setItems] = useState([]);

    // 2. State חדש: האם יש קובץ שנבחר לצפייה?
    const [selectedFile, setSelectedFile] = useState(null);

    const navigate = useNavigate();
    const userId = 1;
    const isRtl = lang === 'he';

    useEffect(() => {
        async function load() {
            try {
                const res = await getFiles(userId);
                setItems(res || []);
            } catch (error) {
                console.error("Error loading files:", error);
            }
        }
        load();
    }, []);

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
                {isRtl ? "האחסון שלי" : "My Drive"}
            </h2>

            <div className="file-list">
                {items.length > 0 ? (
                    items.map(item => (
                        <FileItem
                            key={item.id}
                            item={item}
                            onClick={() => openItem(item)}
                        />
                    ))
                ) : (
                    <p className="status-msg">
                        {isRtl ? "אין קבצים להצגה" : "No files to show"}
                    </p>
                )}
            </div>

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