import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getFolderChildren } from "../api/files";
import FileView from "./FileView";
import FileTable from "../components/FileTable"; // ✅ משתמשים רק בזה
import "./Home.css";
import { getUserIdFromToken } from "../utils/tokenUtils";

export default function FolderView({ lang, onFolderEnter, user }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const isRtl = lang === "he";

    useEffect(() => {
        const userId = getUserIdFromToken();
        if (!userId) {
            navigate("/login");
            return;
        }

        onFolderEnter(id);

        async function load() {
            setIsLoading(true); // ✅ מתחילים טעינה
            try {
                const children = await getFolderChildren(id);
                setItems(children || []);
            } catch (error) {
                console.error("Error loading folder children:", error);
            } finally {
                setIsLoading(false); // ✅ חייב להתעדכן ל-false כדי להציג את הטבלה
            }
        }

        load();

        return () => onFolderEnter(null);
    }, [id, navigate, onFolderEnter]);

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
                <h2 className="page-title" style={{ margin: 0 }}>
                    {isRtl ? "תיקייה" : "Folder"}
                </h2>
                <span style={{ fontSize: "24px" }}>📁</span>
            </header>

            {/* ✅ הטבלה מחליפה את כל ה-file-list הישן */}
            <FileTable
                items={items}
                isLoading={isLoading}
                isRtl={isRtl}
                user={user}
                openItem={openItem}
            />

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