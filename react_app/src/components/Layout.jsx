import { useState } from "react";
import CreateFileForm from "./CreateFileForm";
import "./Layout.css";
import driveLogo from "../logo image/logo.png";

// הוספנו את currentFolderId לרשימת ה-Props
export default function Layout({ children, lang, setLang, currentFolderId }) {
    const [showForm, setShowForm] = useState(false);
    const isRtl = lang === 'he';

    return (
        <div className="home-wrapper" style={{ direction: isRtl ? "rtl" : "ltr" }}>
            <header className="top-bar">
                <div className="logo-container">
                    {/* החלפנו את הטקסט בתמונה */}
                    <img
                        src={driveLogo}
                        className="logo-img"
                    />
                </div>
                <div className="search-container">
                    <span className="search-icon">🔍</span>
                    <input
                        className="search-input"
                        type="text"
                        placeholder={isRtl ? "חיפוש ב-Drive" : "Search in Drive"}
                    />
                </div>
                <button className="lang-button" onClick={() => setLang(isRtl ? 'en' : 'he')}>
                    {isRtl ? "English" : "עברית"}
                </button>
            </header>

            <div className="main-layout">
                <aside className="sidebar">
                    <button className="new-button" onClick={() => setShowForm(true)}>
                        <span style={{ color: '#34a853' }}>＋</span>
                        {isRtl ? "חדש" : "New"}
                    </button>
                    <nav className="side-nav">
                        <div className="nav-item active">{isRtl ? "האחסון שלי" : "My Drive"}</div>
                    </nav>
                </aside>

                <main className="main-content">
                    {children}
                </main>
            </div>

            {showForm && (
                <CreateFileForm
                    userId={1}
                    // כאן אנחנו מעבירים את התיקייה הנוכחית כ-Parent
                    parentId={currentFolderId}
                    onClose={() => setShowForm(false)}
                    lang={lang}
                    onCreated={() => {
                        setShowForm(false);
                        window.location.reload();
                    }}
                />
            )}
        </div>
    );
}