import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getFileContent } from "../api/files";
import "./FileView.css";
import { getUserIdFromToken } from "../utils/tokenUtils";

export default function FileView({ fileId, fileName, onClose, lang = "he" }) {
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);
    const isRtl = lang === "he";
    const navigate = useNavigate();

    useEffect(() => {
        const userId = getUserIdFromToken();
        if (!userId) {
            navigate("/login"); // redirect if no valid token
            return;
        }

        async function load() {
            setLoading(true);
            try {
                const c = await getFileContent(userId, fileId); // use token-based userId
                setContent(c);
            } catch (error) {
                console.error("Error loading file content:", error);
            } finally {
                setLoading(false);
            }
        }

        load();
    }, [fileId, navigate]);

    return (
        /* השכבה השקופה מאחור שסוגרת את החלון בלחיצה */
        <div className="file-modal-overlay" onClick={onClose}>
            <div className="file-view-modal" onClick={(e) => e.stopPropagation()}>
                <header className="file-view-header">
                    <div className="header-right">
                        <span className="file-icon">📄</span>
                        <h2>{fileName || (isRtl ? "צפייה בקובץ" : "File View")}</h2>
                    </div>
                    <button className="close-x-btn" onClick={onClose}>✕</button>
                </header>

                <div className="document-paper">
                    {loading ? (
                        <div className="loading-spinner">{isRtl ? "טוען..." : "Loading..."}</div>
                    ) : (
                        <textarea
                            className="file-textarea"
                            value={content}
                            readOnly
                            style={{ direction: isRtl ? "rtl" : "ltr" }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
