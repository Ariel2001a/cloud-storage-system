import { useState, useEffect } from "react";
import { getDeletedFiles } from "../api/files";
import FileItem from "../components/FileItem";
import FileView from "./FileView"; // 1. ייבוא של קומפוננטת התצוגה
import { useNavigate } from "react-router-dom";
import "./Home.css";
import { FileRightClickMenu } from "../components/FileRightClickMenu"; // אם עדיין לא ייבאת
import { useLang } from "../context/LangContext";
import { getUserIdFromToken } from "../utils/tokenUtils";


export default function BinPage() {
    const [items, setItems] = useState([]);
    const { lang, setLang, isRtl } = useLang();    
    const [userId, setUserId] = useState(null); // store decoded user ID
    const navigate = useNavigate();


    const [menu, setMenu] = useState({
        visible: false,
        x: 0,
        y: 0,
        file: null
    });

    // 2. State חדש: האם יש קובץ שנבחר לצפייה?
    const [selectedFile, setSelectedFile] = useState(null);


    useEffect(() => {
        const id = getUserIdFromToken();
        console.log(id)
        if (!id) {
            navigate('/login'); // redirect to login if no valid token
            return;
        }
        setUserId(id);
    }, [navigate]);

    useEffect(() => {
        if (!userId) return;
        async function load() {
            try {
                console.log(userId)
                const res = await getDeletedFiles();
                setItems(res || []);
                console.log(items)
            } catch (error) {
                console.error("Error loading files:", error);
            }
        }
        load();
    }, [userId]);

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
                {isRtl ? "אשפה" : "Bin"}
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