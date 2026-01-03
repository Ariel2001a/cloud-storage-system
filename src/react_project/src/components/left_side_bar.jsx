export default function DefaultLeftSidebar() {
    return (
        <div>
            <div className="logo">
            <button>EAD Drive</button>
            </div>
            <div className="new_file_folder">
            <button id = "new_file_folder">New ➕</button>
            </div>
            <div className="left_buttons">
            <button>Home 🏠</button>
            <button>My Drive 📁</button>
            <button>Computers 🖥️</button>
            <br />
            <br />
            <button>Shared with me 👤</button>
            <button>Recent ⏰</button>
            <button>Starred ⭐</button>
            <br />
            <br />
            <button>Spam 🚫</button>
            <button>Bin 🗑️</button>
            <button>Storage ☁️</button>
            </div>
        </div>
    );
}
