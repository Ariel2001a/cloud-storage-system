import { useState } from "react";
import { createFileOrFolder } from "../api/files";

export default function CreateFileForm({ userId, onCreated, parentId = null }) {
    const [name, setName] = useState("");
    const [type, setType] = useState("file"); // "file" או "folder"
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) {
            alert("שדה שם הקובץ/תיקייה חייב להיות מלא!");
            return;
        }

        setLoading(true);

        const res = await createFileOrFolder(userId, {
            name,
            type,
            content: type === "file" ? content : undefined,
            parentId,
        });

        setLoading(false);

        if (res) {
            // הצלחה - קוראים לפונקציה של ההורה כדי לעדכן את הרשימה
            onCreated && onCreated(res.id, { name, type });
            setName("");
            setContent("");
        } else {
            alert("שגיאה ביצירת הקובץ/תיקייה");
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ margin: "1rem 0" }}>
            <div>
                <label>שם: </label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="שם הקובץ או התיקייה"
                    required
                />
            </div>

            <div>
                <label>סוג: </label>
                <select value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="file">קובץ</option>
                    <option value="folder">תיקייה</option>
                </select>
            </div>

            {type === "file" && (
                <div>
                    <label>תוכן: </label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="תוכן הקובץ"
                        style={{ width: "100%", height: "100px" }}
                    />
                </div>
            )}

            <button type="submit" disabled={loading}>
                {loading ? "יוצר..." : type === "file" ? "צור קובץ" : "צור תיקייה"}
            </button>
        </form>
    );
}
