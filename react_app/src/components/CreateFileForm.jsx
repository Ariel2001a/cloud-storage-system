import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createFileOrFolder } from "../api/files";
import "./CreateFileForm.css"; // ייבוא ה-CSS הנפרד
import { getUserIdFromToken } from "../utils/tokenUtils"; // ✅ import token utils

export default function CreateFileForm({ onCreated, onClose, parentId = null }) {
    const [name, setName] = useState("");
    const [type, setType] = useState("file");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState(null);

    const navigate = useNavigate();

    // ✅ Get userId from token and redirect if invalid
    useEffect(() => {
        const id = getUserIdFromToken();
        if (!id) {
            navigate("/login");
            return;
        }
        setUserId(id);
    }, [navigate]);

    const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("חובה להזין שם!");

    setLoading(true);

    try {
        // Only pass the object, do NOT pass userId
        const bodyToSend = {
            name: name.trim(),
            type,
            ...(type === "file" && { content }),
            parentId: parentId || null
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
