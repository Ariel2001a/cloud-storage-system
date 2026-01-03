import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getFiles, getFolderChildren } from "../api/files";
import FileItem from "../components/FileItem";

export default function FolderView() {
    const { id } = useParams();
    const [folderItems, setFolderItems] = useState([]);
    const navigate = useNavigate();
    const userId = 1; // החלף עם המשתמש הנוכחי שלך

    useEffect(() => {
        async function load() {
            const children = await getFolderChildren(userId, id);
            setFolderItems(children);
        }
        load();
    }, [id]);

    function openItem(item) {
        if (item.type === "folder") {
            navigate(`/folder/${item.id}`);
        } else {
            navigate(`/file/${item.id}`);
        }
    }

    return (
        <div>
            <h1>📁 תיקייה</h1>

            {folderItems.map((item) => (
                <FileItem key={item.id} item={item} onClick={openItem} />
            ))}
        </div>
    );
}
