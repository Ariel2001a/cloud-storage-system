import { Outlet } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import CreateFileForm from "./CreateFileForm";
import "./Layout.css";
import driveLogo from "../logo image/logo.png";
import { getUserIdFromToken, getDecodedToken } from "../utils/tokenUtils";
import { useNavigate } from "react-router-dom";

export default function Layout({ lang, setLang, currentFolderId, searchTerm, setSearchTerm }) {
    const [showForm, setShowForm] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [user, setUser] = useState(null);  // נשתמש ב-state כדי לשמור את פרטי המשתמש
    const navigate = useNavigate();
    const profileRef = useRef(null);
    const isRtl = lang === 'he';

    // Fetch פרטי משתמש מהשרת לפי id שמופיע ב־JWT
    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (!token) return;

        const decoded = getDecodedToken();
        if (!decoded?.id) return;

        fetch(`http://localhost:8080/api/users/${decoded.id}`, {
            headers: {
                Authorization: token
            }
        })
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch user");
                return res.json();
            })
            .then(data => setUser(data))
            .catch(err => console.error(err));
    }, []);

    // סגירת התפריט בלחיצה מחוץ לפרופיל
    useEffect(() => {
        function handleClickOutside(event) {
            if (showProfile && profileRef.current && !profileRef.current.contains(event.target)) {
                setShowProfile(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showProfile]);

    return (
        <div className="home-wrapper" style={{ direction: isRtl ? "rtl" : "ltr" }}>

            {/* ===== TOP BAR ===== */}
            <header className="top-bar">
                <div className="logo-container">
                    <img src={driveLogo} className="logo-img" alt="Google Drive Logo" />
                </div>

                <div className="search-container">
                    <span className="search-icon">🔍</span>
                    <input
                        className="search-input"
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder={isRtl ? "חיפוש ב-Drive" : "Search in Drive"}
                    />
                </div>

                <div className="header-actions">
                    <button className="lang-button" onClick={() => setLang(isRtl ? 'en' : 'he')}>
                        {isRtl ? "English" : "עברית"}
                    </button>

                    <div className="user-profile-container" ref={profileRef}>
                        <button className="profile-btn" onClick={() => setShowProfile(!showProfile)}>
                            <div className="avatar-placeholder">
                                {user?.first_name?.[0]?.toUpperCase() || "?"}
                            </div>
                        </button>

                        {showProfile && user && (
                            <div className="profile-dropdown">
                                <div className="profile-header-box">
                                    <div className="avatar-large">
                                        {user?.first_name?.[0]?.toUpperCase() || "?"}
                                    </div>
                                    <p className="user-name">{user.first_name} {user.last_name}</p>
                                    <p className="user-email">{user.email}</p>
                                </div>
                                <div className="profile-footer">
                                    <button
                                        className="sign-out-btn"
                                        onClick={() => {
                                            sessionStorage.removeItem("token");
                                            navigate("/login");
                                        }}
                                    >
                                        {isRtl ? "יציאה" : "Sign out"}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* ===== MAIN LAYOUT ===== */}
            <div className="main-layout">
                <aside className="sidebar">
                    <button className="new-button" onClick={() => setShowForm(true)}>
                        <span style={{ color: '#34a853', fontSize: '24px' }}>＋</span>
                        {isRtl ? "חדש" : "New"}
                    </button>

                    <nav className="side-nav">
                        <div className="nav-item active">
                            <span className="nav-icon">📁</span>
                            {isRtl ? "האחסון שלי" : "My Drive"}
                        </div>
                    </nav>
                </aside>

                <main className="main-content">
                    <Outlet />
                </main>
            </div>

            {showForm && (
                <CreateFileForm
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
