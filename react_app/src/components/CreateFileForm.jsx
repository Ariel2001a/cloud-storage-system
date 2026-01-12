import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createFileOrFolder } from "../api/files";
import { getUserIdFromToken } from "../utils/tokenUtils"; // ✅ import token utils
import "./CreateFileForm.css";
import { useLocation } from "react-router-dom";

export default function CreateFileForm({ onCreated, onClose, parentId }) {
    const location = useLocation();
    const [name, setName] = useState("");
    const [type, setType] = useState("file");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    console.log("CreateFileForm Parent ID:", parentId);

    // ✅ Get userId from token and redirect if invalid
    useEffect(() => {
        const userId = getUserIdFromToken();
        if (!userId) {
            navigate("/login");
            return;
        }
    }, [navigate]);

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
        try {
            // Only pass the object, do NOT pass userId
            const bodyToSend = {
                name: name.trim(),
                type,
                content: type === "file" ? content : undefined,
                parentId: parentId ? Number(parentId) : null
            };

            const res = await createFileOrFolder(bodyToSend);

            if (res) {
                onCreated && onCreated(res.id, { name, type });
                onClose();
            }
        } catch (error) {
            console.error("Error creating file/folder:", error);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>צור פריט חדש</h2>
                <form onSubmit={handleSubmit} className="drive-form">
                    <div className="form-group">
                        <label>שם:</label>
                        <input
                            className="drive-input"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>סוג:</label>
                        <select
                            className="drive-select"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                        >
                            <option value="file">קובץ</option>
                            <option value="folder">תיקייה</option>
                        </select>
                    </div>

                    {type === "file" && (
                        <div className="form-group">
                            <label>תוכן:</label>
                            <textarea
                                className="drive-textarea"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />
                        </div>
                    )}

                    <div className="form-actions">
                        <button
                            type="button"
                            className="drive-btn-secondary"
                            onClick={onClose}
                        >
                            ביטול
                        </button>
                        <button type="submit" className="drive-btn-primary" disabled={loading}>
                            {loading ? "יוצר..." : "צור"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}