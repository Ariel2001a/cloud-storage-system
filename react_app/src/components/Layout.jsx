import { useState, useEffect, useRef } from "react"; // 1. הוספנו useEffect ו-useRef
import CreateFileForm from "./CreateFileForm";
import "./Layout.css";
import driveLogo from "../logo image/logo.png";

export default function Layout({ children, lang, setLang, currentFolderId, searchTerm, setSearchTerm, user }) {
    const [showForm, setShowForm] = useState(false);
    const [showProfile, setShowProfile] = useState(false);

    // 2. יצירת ה-Ref כדי שנוכל לדעת מהו אזור הפרופיל
    const profileRef = useRef(null);

    const isRtl = lang === 'he';

    // 3. לוגיקה לסגירת התפריט בלחיצה בחוץ
    useEffect(() => {
        function handleClickOutside(event) {
            // אם התפריט פתוח והלחיצה היא לא בתוך אזור הפרופיל - סגור אותו
            if (showProfile && profileRef.current && !profileRef.current.contains(event.target)) {
                setShowProfile(false);
            }
        }

        // האזנה ללחיצה על כל ה-document
        document.addEventListener("mousedown", handleClickOutside);

        // ניקוי המאזין כשהקומפוננטה יורדת מהמסך
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showProfile]);

    return (
        <div className="home-wrapper" style={{ direction: isRtl ? "rtl" : "ltr" }}>
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

                    {/* 4. הוספת ה-ref למכולה שעוטפת את כל אזור הפרופיל */}
                    <div className="user-profile-container" ref={profileRef}>
                        <button className="profile-btn" onClick={() => setShowProfile(!showProfile)}>
                            <div className="avatar-placeholder">
                                {user?.first_name ? user.first_name[0].toUpperCase() : "?"}
                            </div>
                        </button>

                        {showProfile && user && (
                            <div className="profile-dropdown">
                                <div className="profile-header-box">
                                    <div className="avatar-large">
                                        {user.first_name[0].toUpperCase()}
                                    </div>
                                    <p className="user-name">{user.first_name} {user.last_name}</p>
                                    <p className="user-email">{user.email}</p>
                                </div>
                                <div className="profile-footer">
                                    <button className="sign-out-btn">
                                        {isRtl ? "יציאה" : "Sign out"}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>

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
                    {children}
                </main>
            </div>

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