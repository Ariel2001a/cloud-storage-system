import { useState, useEffect } from "react";
import { getFiles, searchFiles } from "../api/files";
import FileView from "./FileView";
import FileTable from "../components/FileTable"; // ✅ הייבוא החדש
import { useNavigate } from "react-router-dom";
import { getUserIdFromToken } from "../utils/tokenUtils";
import "./Home.css";
import FileItem from "../components/FileItem";
import { FileRightClickMenu } from "../components/FileRightClickMenu"; // אם עדיין לא ייבאת
import { useLang } from "../context/LangContext";




export default function Home({ searchTerm, user }) {
    const [items, setItems] = useState([]);
    const { lang, setLang, isRtl } = useLang();
    const [selectedFile, setSelectedFile] = useState(null);
    const [userId, setUserId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const [menu, setMenu] = useState({
        visible: false,
        x: 0,
        y: 0,
        file: null
    });

    // אימות משתמש
    useEffect(() => {
        const id = getUserIdFromToken();
        if (!id) { navigate('/login'); return; }
        setUserId(id);
    }, [navigate]);

    // טעינת קבצים
    useEffect(() => {
        if (!userId) return;
        async function load() {
            setIsLoading(true);
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
                setIsLoading(false);
            }
        }


        const delayDebounceFn = setTimeout(() => {
            load();
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, userId]);


    function openItem(item) {
        if (item.type === "folder") navigate(`/folder/${item.id}`);
        else setSelectedFile(item);
    }


    console.log(userId)

    return (
        <div className="page-container">
            <h2 className="page-title">

                {searchTerm ? (isRtl ? `תוצאות עבור: ${searchTerm}` : `Results for: ${searchTerm}`)
                    : (isRtl ? "עמוד בית" : "Home Page")}
            </h2>

            {/* ✅ כל הטבלה הצטמצמה לשורה אחת חכמה! */}
            <FileTable
                items={items}
                isLoading={isLoading}
                isRtl={isRtl}
                user={user}
                openItem={openItem}
                setItems={setItems}
            />
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