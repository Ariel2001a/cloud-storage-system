import { useState, useEffect } from "react";
import { getFiles, searchFiles } from "../api/files";
import FileView from "./FileView";
import FileTable from "../components/FileTable"; // ✅ הייבוא החדש
import { useNavigate } from "react-router-dom";
import { getUserIdFromToken } from "../utils/tokenUtils";
import "./Home.css";

export default function Home({ lang, searchTerm, user }) {
    const [items, setItems] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [userId, setUserId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const isRtl = lang === 'he';

    // אימות משתמש
    useEffect(() => {
        const id = getUserIdFromToken();
        if (!id) { navigate('/login'); return; }
        setUserId(id);
    }, [navigate]);

    // טעינת קבצים
    useEffect(() => {
        if (!userId) return;
        async function load() {
            setIsLoading(true);
            try {
                const data = searchTerm?.trim()
                    ? await searchFiles(searchTerm)
                    : await getFiles(userId);
                setItems(data || []);
            } catch (error) {
                console.error("Error loading files:", error);
            } finally {
                setIsLoading(false);
            }
        }
        const timeout = setTimeout(load, 300);
        return () => clearTimeout(timeout);
    }, [searchTerm, userId]);

    function openItem(item) {
        if (item.type === "folder") navigate(`/folder/${item.id}`);
        else setSelectedFile(item);
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