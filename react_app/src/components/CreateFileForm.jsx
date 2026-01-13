import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createFileOrFolder } from "../api/files";
import { getUserIdFromToken } from "../utils/tokenUtils";
import "./CreateFileForm.css";

export default function CreateFileForm({ onCreated, onClose, parentId }) {
    const [name, setName] = useState("");
    const [type, setType] = useState("file"); // file (text), folder, image
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const userId = getUserIdFromToken();
        if (!userId) {
            navigate("/login");
            return;
        }
    }, [navigate]);

    // פונקציה לטיפול בהעלאת תמונה והמרתה ל-Base64
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // עדכון שם הקובץ אוטומטית לפי שם הקובץ שנבחר
        if (!name) setName(file.name);

        const reader = new FileReader();
        reader.onloadend = () => {
            setContent(reader.result); // זה ישמור את ה-Base64 בתוך ה-content
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) return alert("חובה להזין שם!");
        if (type === "image" && !content) return alert("חובה לבחור תמונה!");

        setLoading(true);
        try {
            const bodyToSend = {
                name: name.trim(),
                type, // "file", "folder", או "image"
                content: type !== "folder" ? content : undefined,
                parentId: parentId ? Number(parentId) : null
            };

            const res = await createFileOrFolder(bodyToSend);
            console.log("Response from server:", res);

            if (res) {
                onCreated && onCreated(res.id, { name, type });
                onClose();
            }
        } catch (error) {
            console.error("Error creating item:", error);
            alert("יצירת הפריט נכשלה");
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
                        <label>סוג:</label>
                        <select
                            className="drive-select"
                            value={type}
                            onChange={(e) => {
                                setType(e.target.value);
                                setContent(""); // איפוס תוכן במעבר בין סוגים
                            }}
                        >
                            <option value="file">קובץ טקסט</option>
                            <option value="folder">תיקייה</option>
                            <option value="image">תמונה</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>שם:</label>
                        <input
                            className="drive-input"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="הזן שם פריט..."
                            required
                        />
                    </div>

                    {/* אם זה קובץ טקסט - נציג שדה טקסט */}
                    {type === "file" && (
                        <div className="form-group">
                            <label>תוכן הטקסט:</label>
                            <textarea
                                className="drive-textarea"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />
                        </div>
                    )}

                    {/* אם זה תמונה - נציג כפתור בחירת קובץ */}
                    {type === "image" && (
                        <div className="form-group">
                            <label>בחר תמונה מהמחשב:</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="drive-input"
                            />
                            {content && <p style={{ fontSize: '12px', color: 'green' }}>תמונה נטענה בהצלחה</p>}
                        </div>
                    )}

                    <div className="form-actions">
                        <button type="button" className="drive-btn-secondary" onClick={onClose}>
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