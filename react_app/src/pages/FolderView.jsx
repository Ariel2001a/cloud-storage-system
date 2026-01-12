import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getFolderChildren, searchFiles } from "../api/files";
import FileView from "./FileView";
import FileTable from "../components/FileTable"; // ✅ משתמשים רק בזה
import "./Home.css";
import { useLang } from "../context/LangContext";
import { getUserIdFromToken } from "../utils/tokenUtils";
import { FileRightClickMenu } from "../components/FileRightClickMenu";



export default function FolderView({ user, onFolderEnter, searchTerm }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { lang, setLang, isRtl } = useLang();

    const [menu, setMenu] = useState({
        visible: false,
        x: 0,
        y: 0,
        file: null
    });

    useEffect(() => {
        const userId = getUserIdFromToken();
        if (!userId) {
            navigate("/login");
            return;
        }

        onFolderEnter(id);

        async function load() {
            setIsLoading(true);
            let children;
            try {
                if (searchTerm && searchTerm.trim() !== "") {
                    children = await searchFiles(searchTerm);
                } else {
                    children = await getFolderChildren(id);
                }

                setItems(children || []);
            } catch (error) {
                console.error("Error loading folder children:", error);
            } finally {
                setIsLoading(false); // ✅ חייב להתעדכן ל-false כדי להציג את הטבלה
            }
        }

        load();

        return () => onFolderEnter(null);
    }, [id, navigate, onFolderEnter, searchTerm]);

    function handleRightClick(e, file) {
        e.preventDefault(); // חשוב! מונע את התפריט ברירת המחדל של הדפדפן
        setMenu({
            visible: true,
            x: e.clientX,
            y: e.clientY,
            file
        });
    };

    function openItem(item) {
        if (item.type === "folder") {
            navigate(`/folder/${item.id}`);
        } else {
            setSelectedFile(item);
        }
    }

    return (
        <div className="page-container">
            <header
                className="folder-header-row"
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "15px",
                    marginBottom: "20px",
                    direction: isRtl ? "rtl" : "ltr"
                }}
            >
                <button
                    className="back-btn"
                    onClick={() => navigate(-1)}
                    style={{
                        cursor: "pointer",
                        background: "none",
                        border: "none",
                        fontSize: "20px"
                    }}
                >
                    {isRtl ? "→" : "←"}
                </button>
                <h2 className="page-title">

                    {searchTerm ? (isRtl ? `תוצאות עבור: ${searchTerm}` : `Results for: ${searchTerm}`)
                        : (isRtl ? "תיקייה 📁" : "📁 Folder")}
                </h2>
            </header>

            {/* ✅ הטבלה מחליפה את כל ה-file-list הישן */}
            <FileTable
                items={items}
                isLoading={isLoading}
                isRtl={isRtl}
                user={user}
                openItem={openItem}
            />

            <FileRightClickMenu menu={menu} setMenu={setMenu} items={items} setItems={setItems} lang={lang} />

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