import { useState, useEffect } from "react";
import { getFiles, searchFiles, } from "../api/files";
import FileItem from "../components/FileItem";
import FileView from "./FileView"; // 1. ייבוא של קומפוננטת התצוגה
import { useNavigate } from "react-router-dom";
import "./Home.css";
import { FileRightClickMenu } from "../components/FileRightClickMenu"; // אם עדיין לא ייבאת
import { useLang } from "../context/LangContext";
import { getUserIdFromToken } from "../utils/tokenUtils";
import FileTable from "../components/FileTable";


export default function MyDrive({ searchTerm, user }) {
    const [items, setItems] = useState([]);
    const { lang, setLang, isRtl } = useLang();
    const [userId, setUserId] = useState(null); // store decoded user ID
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);


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
        if (!id) {
            navigate('/login'); // redirect to login if no valid token
            return;
        }
        setUserId(id);
    }, [navigate]);


    useEffect(() => {
        if (!userId) return;
        async function load() {
            setIsLoading(true);
            try {


                let data;
                if (searchTerm && searchTerm.trim() !== "") {
                    data = await searchFiles(searchTerm);
                } else {
                    data = await getFiles();
                }
                setItems(data || []);

            } catch (error) {
                console.error("Error loading files:", error);
            } finally {
                setIsLoading(false);
            }
        }


        const delayDebounceFn = setTimeout(() => {
            load();
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, userId]);

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

                {searchTerm ? (isRtl ? `תוצאות עבור: ${searchTerm}` : `Results for: ${searchTerm}`)
                    : (isRtl ? "האחסון שלי" : "My Drive")}
            </h2>

            {/* ✅ כל הטבלה הצטמצמה לשורה אחת חכמה! */}
            <FileTable
                items={items}
                isLoading={isLoading}
                isRtl={isRtl}
                user={user}
                openItem={openItem}
                setItems={setItems}
            />
            <FileRightClickMenu menu={menu} setMenu={setMenu} items={items} setItems={setItems} />


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

