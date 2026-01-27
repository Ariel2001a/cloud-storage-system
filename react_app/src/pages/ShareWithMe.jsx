import { useState, useEffect } from "react";
import { getSharedFiles, searchFiles } from "../api/files";
import FileItem from "../components/FileItem";
import FileView from "./FileView";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import { FileRightClickMenu } from "../components/FileRightClickMenu";
import { useLang } from "../context/LangContext";
import { getUserIdFromToken } from "../utils/tokenUtils";
import FileTableShred from "../components/FileTableShred";



export default function ShareWithMe({ searchTerm, user }) {
    const [items, setItems] = useState([]);
    const { lang, setLang, isRtl } = useLang();
    const [userId, setUserId] = useState(null); // store decoded user ID
    const [isLoading, setIsLoading] = useState(true);


    const [menu, setMenu] = useState({
        visible: false,
        x: 0,
        y: 0,
        file: null
    });


    const [selectedFile, setSelectedFile] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const id = getUserIdFromToken();
        if (!id) {
            navigate('/login'); // redirect to login if no valid token
            return;
        }
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
                    data = await getSharedFiles();
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

    function handleRightClick(e, file) {
        e.preventDefault();
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

    return (
        <div className="page-container">
            <h2 className="page-title">

                {searchTerm ? (isRtl ? `תוצאות עבור: ${searchTerm}` : `Results for: ${searchTerm}`)
                    : (isRtl ? "שותף איתי" : "Share With Me")}
            </h2>


            <FileTableShred
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