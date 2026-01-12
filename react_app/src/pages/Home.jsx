import { useState, useEffect } from "react";
import FileItem from "../components/FileItem";
import FileView from "./FileView"; // 1. ייבוא של קומפוננטת התצוגה
import { useNavigate } from "react-router-dom";
import "./Home.css";
import { FileRightClickMenu } from "../components/FileRightClickMenu"; // אם עדיין לא ייבאת
import { useLang } from "../context/LangContext";
import { getFiles, searchFiles } from "../api/files";
import { getUserIdFromToken } from "../utils/tokenUtils";

const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return "--";
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};



export default function Home({ searchTerm, user }) {
    const [items, setItems] = useState([]);
     const { lang, setLang, isRtl } = useLang();
    const [selectedFile, setSelectedFile] = useState(null);
    const [userId, setUserId] = useState(null); // store decoded user ID
    const [isLoading, setIsLoading] = useState(true); // סטייט חדש לטעינה
    const navigate = useNavigate();
  
      const [menu, setMenu] = useState({
        visible: false,
        x: 0,
        y: 0,
        file: null
    });

    // ✅ Decode token and redirect if missing/invalid
    useEffect(() => {
        const id = getUserIdFromToken();
        if (!id) {
            navigate('/login'); // redirect to login if no valid token
            return;
        }
        setUserId(id);
    }, [navigate]);

    // ✅ Load files after we have userId
    useEffect(() => {
        if (!userId) return;

        async function load() {
            setIsLoading(true); // מתחילים טעינה - זה ימנע את הודעת "אין קבצים"
            try {
                let data;
                if (searchTerm && searchTerm.trim() !== "") {
                    data = await searchFiles(searchTerm);
                } else {
                    data = await getFiles();
                }
                setItems(data || []);
                
            } catch (error) {
                console.error("Error loading files:", error);
            } finally {
                setIsLoading(false); // מסיימים טעינה בכל מקרה (הצלחה או כישלון)
            }
        }
        const delayDebounceFn = setTimeout(() => {
            load();
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, userId]);

        function handleRightClick(e, file) {
        e.preventDefault(); // חשוב! מונע את התפריט ברירת המחדל של הדפדפן
        setMenu({
            visible: true,
            x: e.clientX,
            y: e.clientY,
            file
        });
    };

    function openItem(item) {
        if (item.type === "folder") {
            navigate(`/folder/${item.id}`);
        } else {
            setSelectedFile(item);
        }
    }


    console.log(userId)

    return (
        <div className="page-container">
            <h2 className="page-title">
                {searchTerm ? (isRtl ? `תוצאות חיפוש עבור: ${searchTerm}` : `Search results for: ${searchTerm}`)
                    : (isRtl ? "עמוד בית" : "Home Page")}
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
                        {/* תנאי משולש: קודם בודקים אם בטעינה, אחר כך אם יש קבצים */}
                        {isLoading ? (
                            <tr>
                                <td colSpan="4" className="status-msg">
                                    {isRtl ? "טוען קבצים..." : "Loading files..."}
                                </td>
                            </tr>
                        ) : items.length > 0 ? (
                            items.map(item => (
                                <tr key={item.id} className="file-row" onClick={() => openItem(item)} onContextMenu={(e) => handleRightClick(e, item)}
>
                                    <td className="col-name">
                                        <span className="file-icon">{item.type === 'folder' ? '📁' : '📄'}</span>
                                        {item.name}
                                    </td>
                                    <td className="col-owner">
                                        <div className="owner-info">
                                            <div className="owner-avatar-mini">
                                                {user?.first_name ? user.first_name[0].toUpperCase() : "U"}
                                            </div>
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
            
      <FileRightClickMenu menu={menu} setMenu={setMenu} items={items} setItems={setItems} />
      
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
