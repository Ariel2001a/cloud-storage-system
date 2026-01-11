import { useState, useEffect } from "react";
import { getFiles } from "../api/files";
import FileItem from "../components/FileItem";
import FileView from "./FileView";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import { getUserIdFromToken } from "../utils/tokenUtils";

export default function Home({ lang }) {
    const [items, setItems] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [userId, setUserId] = useState(null); // store decoded user ID
    const navigate = useNavigate();
    const isRtl = lang === 'he';

    // ✅ Decode token and redirect if missing/invalid
    useEffect(() => {
        const id = getUserIdFromToken();
        if (!id) {
            navigate('/login'); // redirect to login if no valid token
            return;
        }
        setUserId(id);
    }, [navigate]);

    // ✅ Load files after we have userId
    useEffect(() => {
        if (!userId) return;

        async function load() {
            try {
                const res = await getFiles(userId);
                setItems(res || []);
            } catch (error) {
                console.error("Error loading files:", error);
            }
        }

        load();
    }, [userId]);

    function openItem(item) {
        if (item.type === "folder") {
            navigate(`/folder/${item.id}`);
        } else {
            setSelectedFile(item);
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
