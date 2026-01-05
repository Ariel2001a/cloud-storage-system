import { useState, useEffect } from "react";
import { getFiles } from "../api/files";
import FileItem from "../components/FileItem";
import CreateFileForm from "../components/CreateFileForm"; // הקומפוננטה החדשה שכוללת CSS משלה
import { useNavigate } from "react-router-dom";
import "./Home.css";
import Default_picture from '../uploads/default.png';
import Alogo from '../uploads/Alogo.png';

export default function Home() {
    const [items, setItems] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [lang, setLang] = useState('he');

    const navigate = useNavigate();
    const userId = 1;
    const isRtl = lang === 'he';

    useEffect(() => {
        async function load() {
            const res = await getFiles(userId);
            setItems(res);
        }
        load();
    }, []);

    function handleCreated(id, file) {
        setItems((prev) => [...prev, { ...file, id }]);
        setShowForm(false);
    }

    return (
        <div className="home-wrapper" style={{ direction: isRtl ? "rtl" : "ltr" }}>

            {/* תפריט עליון */}
            <header className="top-bar">
                <div className="logo">
                    <img
                    src={Alogo} 
                    alt="Logo" 
                    style={{ width: "100%", height: "50px" }} />
                </div>
                <div className="search-container">
                    <input className="search-input" type="text" placeholder={isRtl ? "חיפוש..." : "Search..."} />
                </div>
                <button className="lang-button" onClick={() => setLang(isRtl ? 'en' : 'he')}>
                    {isRtl ? "English" : "עברית"}
                </button>
                                <div className="logo">
                    <img
                    src={Default_picture} 
                    alt="Logo" 
                    style={{ width: "50px", height: "50px" }} />
                </div>
            </header>

            <div className="main-layout">
                {/* סרגל צד עם כפתור חדש */}
                <aside className="sidebar">
                    <button className="new-button" onClick={() => setShowForm(true)}>
                        <span style={{ color: '#34a853' }}>＋</span> {isRtl ? "חדש" : "New"}
                    </button>
                    <button className="sidebar-button" style={isRtl ? { textAlign: 'right' } : { textAlign: 'left' }}>{isRtl ? "🏠 בית" : "🏠 Home"}</button>
                    <br />
                    <button className="sidebar-button" style={isRtl ? { textAlign: 'right' } : { textAlign: 'left' }}>{isRtl ? "📁 האחסון שלי" : "📁 My Drive"}</button>
                    <br />
                    <br />
                    <button className="sidebar-button" style={isRtl ? { textAlign: 'right' } : { textAlign: 'left' }}>{isRtl ? "👤 שותף איתי" : "👤 Shared with me"}</button>
                    <br />
                    <button className="sidebar-button" style={isRtl ? { textAlign: 'right' } : { textAlign: 'left' }}>{isRtl ? "⏰ אחרונים" : "⏰ Recent"}</button>
                    <br />
                    <br />
                    <button className="sidebar-button" style={isRtl ? { textAlign: 'right' } : { textAlign: 'left' }}>{isRtl ? "⭐ מסומנים בכוכב" : "⭐ Starred"}</button>
                    <br />
                    <button className="sidebar-button" style={isRtl ? { textAlign: 'right' } : { textAlign: 'left' }}>{isRtl ? "🗑️ אשפה" : "🗑️ Bin"}</button>
                </aside>

                {/* רשימת קבצים */}
                <main className="main-content">
                    <h2>{isRtl ? "הקבצים שלי" : "My Files"}</h2>
                    <div className="file-list">
                        {items.map(item => (
                            <FileItem key={item.id} item={item} onClick={() => navigate(`/file/${item.id}`)} />
                        ))}
                    </div>
                </main>
            </div>

            {/* הטופס שמנהל את הריחוף של עצמו */}
            {showForm && (
                <CreateFileForm
                    userId={userId}
                    onCreated={handleCreated}
                    onClose={() => setShowForm(false)}
                />
            )}
        </div>
    );
}