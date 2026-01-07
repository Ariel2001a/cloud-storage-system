import { useState } from "react";
import { Outlet } from "react-router-dom";
import CreateFileForm from "./CreateFileForm";
import "./Layout.css";
import driveLogo from "../logo image/logo.png";

export default function Layout({ lang, setLang, currentFolderId }) {
    const [showForm, setShowForm] = useState(false);
    const isRtl = lang === 'he';

    return (
        <div className="home-wrapper" style={{ direction: isRtl ? "rtl" : "ltr" }}>

            {/* ===== TOP BAR ===== */}
            <header className="top-bar">
                <div className="logo-container">
                    <img src={driveLogo} className="logo-img" />
                </div>

                <div className="search-container">
                    <input
                        className="search-input"
                        type="text"
                        placeholder={isRtl ? "חיפוש ב-Drive" : "Search in Drive"}
                    />
                </div>

                <button
                    className="lang-button"
                    onClick={() => setLang(isRtl ? 'en' : 'he')}
                >
                    {isRtl ? "English" : "עברית"}
                </button>
            </header>

            {/* ===== MAIN LAYOUT ===== */}
            <div className="main-layout">

                {/* SIDEBAR */}
                <aside className="sidebar">
                    <button className="new-button" onClick={() => setShowForm(true)}>
                        <span style={{ color: '#34a853' }}>＋</span>
                        {isRtl ? "חדש" : "New"}
                    </button>

                    <nav className="side-nav">
                        <div className="nav-item active">
                            {isRtl ? "האחסון שלי" : "My Drive"}
                        </div>
                    </nav>
                </aside>

                {/* MAIN CONTENT (פה נטען התוכן של Home / FolderView) */}
                <main className="main-content">
                    <Outlet />
                </main>
            </div>

            {/* ===== CREATE FILE POPUP ===== */}
            {showForm && (
                <CreateFileForm
                    userId={1}
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
