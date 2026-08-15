// src/pages/Home.jsx
import { useState, useEffect } from "react";
import { getLastOpenFiles, searchFiles } from "../api/files";
import FileView from "./FileView";
import FileTableHome from "../components/FileTableHome";
import { useNavigate } from "react-router-dom";
import { getUserIdFromToken } from "../utils/tokenUtils";
import defaultAvatar from "../images/default.png";
import "./Home.css";
import FileItem from "../components/FileItem";
import { FileRightClickMenu } from "../components/FileRightClickMenu";
import { useLang } from "../context/LangContext";
import { useUser } from "../context/UserContext";



export default function Home({ searchTerm }) {
    const [items, setItems] = useState([]);
    const { lang, setLang, isRtl } = useLang();
    const [selectedFile, setSelectedFile] = useState(null);
    const [userId, setUserId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const { user } = useUser();
    const [menu, setMenu] = useState({
        visible: false,
        x: 0,
        y: 0,
        file: null
    });


    useEffect(() => {
        const id = getUserIdFromToken();
        if (!id) { navigate('/login'); return; }
        setUserId(id);
    }, [navigate]);


    useEffect(() => {
        if (!userId) return;
        async function load() {
            setIsLoading(true);
            try {


                let data;
                if (searchTerm && searchTerm.trim() !== "") {
                    data = await searchFiles(searchTerm);
                } else {
                    data = await getLastOpenFiles();
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


    const getCreatorAvatar = () => {
        if (!user) return defaultAvatar;
        if (user.image && user.image.startsWith("data:image")) return user.image;
        if (user.image && user.image.trim() !== "") return `http://localhost:8080/uploads/${user.image}`;
        return defaultAvatar;
    };

    return (
        <div className="page-container">
            <h2 className="page-title">

                {searchTerm ? (isRtl ? `תוצאות עבור: ${searchTerm}` : `Results for: ${searchTerm}`)
                    : (isRtl ? "עמוד בית" : "Home Page")}
            </h2>


            <FileTableHome
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
                    fileType={selectedFile.type}
                    lang={lang}
                    onClose={() => setSelectedFile(null)}
                />
            )}
        </div>
    );
}