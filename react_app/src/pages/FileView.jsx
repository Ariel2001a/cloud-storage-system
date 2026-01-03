import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getFileContent } from "../api/files";

export default function FileView() {
    const { id } = useParams();
    const [content, setContent] = useState("");
    const [fileName, setFileName] = useState("קובץ"); // אם אין שם מה־API, אפשר לשים ברירת מחדל
    const userId = 1; // החלף עם המשתמש הנוכחי שלך

    useEffect(() => {
        async function load() {
            const c = await getFileContent(userId, id);
            setContent(c); // getFileContent מחזיר כבר מחרוזת תוכן
        }

        load();
    }, [id]);

    return (
        <div>
            <h1>📄 {fileName}</h1>

            <textarea
                value={content}
                readOnly
                style={{ width: "100%", height: "300px", direction: "rtl" }}
            />
        </div>
    );
}
