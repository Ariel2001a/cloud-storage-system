import { useState } from "react";
import CreateFileForm from "./CreateFileForm";
import "./Layout.css";
import driveLogo from "../uploads/logo.png";
import Default_picture from "../uploads/default.png";
import { getFiles, getSharedFiles, getDeletedFiles } from '../api/files';
import { Navigate } from "react-router-dom";
import { useLang } from "../context/LangContext";

// הוספנו את currentFolderId לרשימת ה-Props
export default function Layout({ children, currentFolderId }) {
    const [showForm, setShowForm] = useState(false);
    const { lang, setLang, isRtl } = useLang();
    
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
                    <input
                        className="search-input"
                        type="text"
                        placeholder={isRtl ? "חיפוש ב-Drive" : "Search in Drive"}
                    />
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
                <aside className="sidebar">
                    <button className="new-button" onClick={() => setShowForm(true)}>
                        <span style={{ color: '#34a853' }}>＋</span>
                        {isRtl ? "חדש" : "New"}
                    </button>
                    <br />
                    <div className={`sidebar-buttons ${isRtl ? 'rtl' : 'ltr'}`}>
                        <button className="sidebar-button" onClick={() => window.location.href = "/"}>🏠 {isRtl ? "בית" : "Home"}</button>
                        <button className="sidebar-button" onClick={() => window.location.href = "/my drive"}>📁 {isRtl ? "האחסון שלי" : "My Drive"}</button>

                        <button className="sidebar-button" onClick={() => window.location.href = "/share with me"}>👤 {isRtl ? "שותף איתי" : "Shared with me"}</button>
                        <button className="sidebar-button" onClick={() => window.location.href = "/recent"}>⏰ {isRtl ? "אחרונים" : "Recent"}</button>

                        <button className="sidebar-button" onClick={() => window.location.href = "/starred"}>⭐ {isRtl ? "מסומנים בכוכב" : "Starred"}</button>
                        <button className="sidebar-button" onClick={() => window.location.href = "/deleted"}>🗑️ {isRtl ? "אשפה" : "Bin"}</button>
                    </div>
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