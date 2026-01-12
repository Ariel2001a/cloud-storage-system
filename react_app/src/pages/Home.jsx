// src/pages/Home.jsx
import { useState, useEffect } from "react";
import FileItem from "../components/FileItem";
import { getFiles, searchFiles } from "../api/files";
import FileView from "./FileView";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import { getUserIdFromToken } from "../utils/tokenUtils";
import defaultAvatar from "../images/default.png"; // default avatar

const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return "--";
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

export default function Home({ lang, searchTerm, user }) {
    const [items, setItems] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [userId, setUserId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const isRtl = lang === 'he';

    // Decode token
    useEffect(() => {
        const id = getUserIdFromToken();
        if (!id) {
            navigate('/login');
            return;
        }
        setUserId(id);
    }, [navigate]);

    // Load files
    useEffect(() => {
        if (!userId) return;

        async function load() {
            setIsLoading(true);
            try {
                let data;
                if (searchTerm && searchTerm.trim() !== "") {
                    data = await searchFiles(searchTerm);
                } else {
                    data = await getFiles(userId);
                }
                setItems(data || []);
            } catch (error) {
                console.error("Error loading files:", error);
            } finally {
                setIsLoading(false);
            }
        }

        const delayDebounceFn = setTimeout(load, 300);
        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, userId]);

    function openItem(item) {
        if (item.type === "folder") {
            navigate(`/folder/${item.id}`);
        } else {
            setSelectedFile(item);
        }
    }

    // ✅ Get avatar for file creator (use logged-in user object)
    const getCreatorAvatar = () => {
        if (!user) return defaultAvatar;
        if (user.image && user.image.startsWith("data:image")) return user.image;
        if (user.image && user.image.trim() !== "") return `http://localhost:8080/uploads/${user.image}`;
        return defaultAvatar;
    };

    return (
        <div className="page-container">
            <h2 className="page-title">
                {searchTerm
                    ? (isRtl ? `תוצאות חיפוש עבור: ${searchTerm}` : `Search results for: ${searchTerm}`)
                    : (isRtl ? "האחסון שלי" : "My Drive")}
            </h2>

            <div className="table-container">
                <table className="files-table">
                    <thead>
                        <tr>
                            <th>{isRtl ? "שם" : "Name"}</th>
                            <th>{isRtl ? "בעלים" : "Owner"}</th>
                            <th>{isRtl ? "שינוי אחרון" : "Last modified"}</th>
                            <th>{isRtl ? "גודל קובץ" : "File size"}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan="4" className="status-msg">
                                    {isRtl ? "טוען קבצים..." : "Loading files..."}
                                </td>
                            </tr>
                        ) : items.length > 0 ? (
                            items.map(item => (
                                <tr key={item.id} className="file-row" onClick={() => openItem(item)}>
                                    <td className="col-name">
                                        <span className="file-icon">{item.type === 'folder' ? '📁' : '📄'}</span>
                                        {item.name}
                                    </td>
                                    <td className="col-owner">
                                        <div className="owner-info">
                                            <img
                                                src={getCreatorAvatar()}
                                                alt="Creator"
                                                className="owner-avatar-mini"
                                                style={{
                                                    width: "32px",
                                                    height: "32px",
                                                    borderRadius: "50%",
                                                    objectFit: "cover"
                                                }}
                                            />
                                            <span>{isRtl ? "אני" : "me"}</span>
                                        </div>
                                    </td>
                                    <td className="col-date">
                                        {new Date(item.updatedAt || item.createdAt).toLocaleDateString(isRtl ? 'he-IL' : 'en-US')}
                                    </td>
                                    <td className="col-size">
                                        {item.type === 'folder' ? '--' : formatFileSize(item.size)}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="status-msg">
                                    {isRtl ? "אין קבצים להצגה" : "No files to show"}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {selectedFile && (
                <FileView
                    fileId={selectedFile.id}
                    fileName={selectedFile.name}
                    lang={lang}
                    onClose={() => setSelectedFile(null)}
                />
            )}
        </div>
    );
}
