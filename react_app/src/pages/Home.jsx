import { useState, useEffect } from "react";
import { getFiles } from "../api/files";
import FileItem from "../components/FileItem";
import CreateFileForm from "../components/CreateFileForm";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const [items, setItems] = useState([]);
    const navigate = useNavigate();
    const userId = 1;

    useEffect(() => {
        async function load() {
            const res = await getFiles(userId);
            setItems(res);
        }
        load();
    }, []);

    function openItem(item) {
        if (item.type === "folder") navigate(`/folder/${item.id}`);
        else navigate(`/file/${item.id}`);
    }

    function handleCreated(id, file) {
        setItems((prev) => [...prev, { ...file, id }]);
    }

    return (
        <div>
            <h1>הקבצים שלי</h1>

            <CreateFileForm userId={userId} onCreated={handleCreated} />

            {items.map((item) => (
                <FileItem key={item.id} item={item} onClick={openItem} />
            ))}
        </div>
    );
}
