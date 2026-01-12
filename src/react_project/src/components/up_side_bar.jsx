import defaultLogo from "../react_uploads/default.png";

export default function DefaultUpSidebar() {
    return (
        <div>
            <img className="imageUser"
            src={defaultLogo} 
            alt="Logo" 
            style={{ width: "75px", height: "75px" }} 
            />
 
        </div>
    );
}
