import { Outlet, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import CreateFileForm from "./CreateFileForm";
import "./Layout.css";
import driveLogo from "../logo image/logo.png";
import { getDecodedToken } from "../utils/tokenUtils";
import { useNavigate } from "react-router-dom";
import { useLang } from "../context/LangContext";

export default function Layout({children, currentFolderId, searchTerm, setSearchTerm }) {
    const [showForm, setShowForm] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const profileRef = useRef(null);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const { lang, setLang, isRtl } = useLang();

    // ✅ Dark mode state
    const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved === "true" ? true : false;
});

// Whenever the button is clicked, also save to localStorage
const toggleDarkMode = () => {
    setIsDarkMode(prev => {
        localStorage.setItem("darkMode", !prev);
        return !prev;
    });
};

    // ✅ Check if current page is home
    const location = useLocation();
    const isHomePage = location.pathname === "/";

    // Fetch user details
    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (!token) return;

        const decoded = getDecodedToken();
        if (!decoded?.id) return;

        fetch(`http://localhost:8080/api/users/${decoded.id}`, {
            headers: { Authorization: token }
        })
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch user");
                return res.json();
            })
            .then(data => setUser(data))
            .catch(err => console.error(err));
    }, []);

    // Close profile dropdown on click outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (showProfile && profileRef.current && !profileRef.current.contains(event.target)) {
                setShowProfile(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showProfile]);

    // Helper to get avatar src
   const getAvatarSrc = () => {
  if (
    typeof user?.image === "string" &&
    user.image.startsWith("data:image")
  ) {
    // Base64 image
    return user.image;
  }

  if (
    typeof user?.image === "string" &&
    user.image.trim() !== ""
  ) {
    // Filename from backend
    return `http://localhost:8080/uploads/${user.image}`;
  }

  return null; // fallback → letter avatar
};

    return (
        <div
            className={`home-wrapper ${isDarkMode ? "dark" : ""}`}
            style={{ direction: isRtl ? "rtl" : "ltr" }}
        >

            {/* ===== TOP BAR ===== */}
            <header className="top-bar">
                <div className="logo-container">
                    <img src={driveLogo} className="logo-img" alt="Drive Logo" />
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
                    {/* Language button */}
                    <button className="lang-button" onClick={() => setLang(isRtl ? 'en' : 'he')}>
                        {isRtl ? "English" : "עברית"}
                    </button>

                    {/* Theme button – only on Home */}
                  {(
   <button
    className={`theme-toggle-btn ${isDarkMode ? "moon" : "sun"}`}
    onClick={toggleDarkMode}
>
    {isDarkMode ? "🌙" : "🌞"}
</button>
)}
                    {/* User profile */}
                    <div className="user-profile-container" ref={profileRef}>
                        <button className="profile-btn" onClick={() => setShowProfile(!showProfile)}>
                            {getAvatarSrc() ? (
                                <img
                                    src={getAvatarSrc()}
                                    alt="Profile"
                                    className="avatar-img"
                                    style={{
                                        width: "32px",
                                        height: "32px",
                                        borderRadius: "50%",
                                        objectFit: "cover"
                                    }}
                                />
                            ) : (
                                <div className="avatar-placeholder">
                                    {user?.first_name?.[0]?.toUpperCase() || "?"}
                                </div>
                            )}
                        </button>

                        {showProfile && user && (
                            <div className="profile-dropdown">
                                <div className="profile-header-box">
                                    {getAvatarSrc() ? (
                                        <img
                                            src={getAvatarSrc()}
                                            alt="Profile"
                                            className="avatar-large-img"
                                            style={{
                                                width: "80px",
                                                height: "80px",
                                                borderRadius: "50%",
                                                objectFit: "cover"
                                            }}
                                        />
                                    ) : (
                                        <div className="avatar-large">
                                            {user?.first_name?.[0]?.toUpperCase() || "?"}
                                        </div>
                                    )}
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
                    <br />
                    <div className={`sidebar-buttons ${isRtl ? 'rtl' : 'ltr'}`}>
                        <button className="sidebar-button" onClick={() => window.location.href = "/"}>🏠 {isRtl ? "בית" : "Home"}</button>
                        <button className="sidebar-button" onClick={() => window.location.href = "/my-drive"}>📁 {isRtl ? "האחסון שלי" : "My Drive"}</button>
                        <button className="sidebar-button" onClick={() => window.location.href = "/share-with-me"}>👤 {isRtl ? "שותף איתי" : "Shared with me"}</button>
                        <button className="sidebar-button" onClick={() => window.location.href = "/recent"}>⏰ {isRtl ? "אחרונים" : "Recent"}</button>
                        <button className="sidebar-button" onClick={() => window.location.href = "/starred"}>⭐ {isRtl ? "מסומנים בכוכב" : "Starred"}</button>
                        <button className="sidebar-button" onClick={() => window.location.href = "/deleted"}>🗑️ {isRtl ? "אשפה" : "Bin"}</button>
                    </div>
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
