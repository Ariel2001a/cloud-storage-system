import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createFileOrFolder } from "../api/files";
import { getUserIdFromToken } from "../utils/tokenUtils";
import "./CreateFileForm.css";


export default function CreateFileForm({ onCreated, onClose, parentId, lang }) {
    const [name, setName] = useState("");
    const [type, setType] = useState("file");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();


    const isRtl = lang === "he";

    useEffect(() => {
        const userId = getUserIdFromToken();
        if (!userId) {
            navigate("/login");
            return;
        }
    }, [navigate]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!name) setName(file.name);
        const reader = new FileReader();
        reader.onloadend = () => setContent(reader.result);
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) return alert(isRtl ? "חובה להזין שם!" : "Name is required!");

        setLoading(true);
        try {
            const bodyToSend = {
                name: name.trim(),
                type,
                content: type !== "folder" ? content : undefined,
                parentId: parentId ? Number(parentId) : null
            };

            const res = await createFileOrFolder(bodyToSend);
            if (res) {
                onCreated && onCreated(res.id, { name, type });
                onClose();
            }
        } catch (error) {
            alert(isRtl ? "יצירת הפריט נכשלה" : "Failed to create item");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose} dir={isRtl ? "rtl" : "ltr"}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>

                <h2>{isRtl ? "צור פריט חדש" : "Create New Item"}</h2>

                <form onSubmit={handleSubmit} className="drive-form">

                    <div className="form-group">
                        <label>{isRtl ? "סוג:" : "Type:"}</label>
                        <select
                            className="drive-select"
                            value={type}
                            onChange={(e) => {
                                setType(e.target.value);
                                setContent("");
                            }}
                        >
                            <option value="file">{isRtl ? "קובץ טקסט" : "Text File"}</option>
                            <option value="folder">{isRtl ? "תיקייה" : "Folder"}</option>
                            <option value="image">{isRtl ? "תמונה" : "Image"}</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>{isRtl ? "שם:" : "Name:"}</label>
                        <input
                            className="drive-input"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={isRtl ? "הזן שם פריט..." : "Enter item name..."}
                            required
                        />
                    </div>

                    {type === "file" && (
                        <div className="form-group">
                            <label>{isRtl ? "תוכן הטקסט:" : "Text Content:"}</label>
                            <textarea
                                className="drive-textarea"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />
                        </div>
                    )}

                    {type === "image" && (
                        <div className="form-group">
                            <label>{isRtl ? "בחר תמונה:" : "Choose image:"}</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="drive-input"
                            />
                        </div>
                    )}

                    <div className="form-actions">
                        <button type="button" className="drive-btn-secondary" onClick={onClose}>
                            {isRtl ? "ביטול" : "Cancel"}
                        </button>
                        <button type="submit" className="drive-btn-primary" disabled={loading}>
                            {loading ? (isRtl ? "יוצר..." : "Creating...") : (isRtl ? "צור" : "Create")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}