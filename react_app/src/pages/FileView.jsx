import { useState, useEffect } from "react";
import { getFileContent } from "../api/files";
import "./FileView.css";

export default function FileView({ fileId, fileName, onClose, lang = "he" }) {
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);
    const isRtl = lang === "he";
    const userId = 1;

    useEffect(() => {
        async function load() {
            setLoading(true);
            try {
                const data = await getFileContent(userId, fileId);
                // גישה לנתיב הנכון לפי תמונת ה-Network ששלחת
                if (data !== null && data !== undefined) {
                    setContent(data);
                }
            } catch (error) {
                console.error("Failed to load file content:", error);
            }
            setLoading(false);
        }
        load();
    }, [fileId]);

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