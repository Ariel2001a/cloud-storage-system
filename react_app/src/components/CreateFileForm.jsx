import { useState } from "react";
import { createFileOrFolder } from "../api/files";
import "./CreateFileForm.css";
import { useLocation } from "react-router-dom";

export default function CreateFileForm({ userId, onCreated, onClose }) {
    const location = useLocation();
    const [name, setName] = useState("");
    const [type, setType] = useState("file");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) return alert("חובה להזין שם!");

        // חילוץ ה-ID מה-URL
        const currentPath = window.location.pathname;
        const parts = currentPath.split('/');
        const folderIdIndex = parts.indexOf('folder');
        let idFromUrl = null;

        if (folderIdIndex !== -1 && parts[folderIdIndex + 1]) {
            idFromUrl = Number(parts[folderIdIndex + 1]);
        }

        setLoading(true);
        const res = await createFileOrFolder(userId, {
            name,
            type,
            content: type === "file" ? content : undefined,
            // התיקון הקריטי: השרת שלכם ב-req.body מחפש parentId!
            parentId: idFromUrl
        });
        setLoading(false);

        if (res) {
            onCreated && onCreated();
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>צור פריט חדש</h2>
                <form onSubmit={handleSubmit} className="drive-form">
                    <div className="form-group">
                        <label>שם:</label>
                        <input className="drive-input" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>סוג:</label>
                        <select className="drive-select" value={type} onChange={(e) => setType(e.target.value)}>
                            <option value="file">קובץ</option>
                            <option value="folder">תיקייה</option>
                        </select>
                    </div>
                    {type === "file" && (
                        <div className="form-group">
                            <label>תוכן:</label>
                            <textarea className="drive-textarea" value={content} onChange={(e) => setContent(e.target.value)} />
                        </div>
                    )}
                    <div className="form-actions">
                        <button type="button" className="drive-btn-secondary" onClick={onClose}>ביטול</button>
                        <button type="submit" className="drive-btn-primary" disabled={loading}>
                            {loading ? "יוצר..." : "צור"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}