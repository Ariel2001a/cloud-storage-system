import ALogo from "../react_uploads/Alogo.png";


export default function DefaultLeftSidebar() {
    return (
        <div>
            <div className="logo">
                <img className="imageUser"
                src={ALogo} 
                alt="Logo" 
                style={{ width: "200px", height: "50px" }} />
            </div>
            <div className="new-button">
            <button>New ➕</button>
            </div>
            <div className="sidebar">
            <button>Home 🏠</button>
            <br />
            <button>My Drive 📁</button>
            <br />
            <br />
            <button>Shared with me 👤</button>
            <br />
            <button>Recent ⏰</button>
            <br />
            <br />
            <button>Starred ⭐</button>
            <br />
            <button>Bin 🗑️</button>
            </div>
        </div>
    );
}
