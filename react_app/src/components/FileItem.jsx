import "./fileItem.css";
import React from "react";

export default function FileItem({ item, onClick, onRightClick }) {
    return (
        <div className="file-item" onClick={() => onClick(item)} onContextMenu={(e) => onRightClick(e, item)}>
            {item.type === "folder" ? "📁" : "📄"} {item.name}
        </div>
    );
}