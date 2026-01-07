import "./fileItem.css";

export default function FileItem({ item, onClick }) {
    return (
        <div className="file-item" onClick={() => onClick(item)}>
            {item.type === "folder" ? "📁" : "📄"} {item.name}
        </div>
    );
}
