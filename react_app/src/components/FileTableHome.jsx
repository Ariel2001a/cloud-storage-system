import React from 'react';
import "./FileTable.css";
import { useState } from 'react';
import { FileRightClickMenu } from "../components/FileRightClickMenu";


const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return "--";
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return "\u200e" + parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};


export default function FileTableHome({ items, setItems, isLoading, isRtl, user, openItem }) {
    const [menu, setMenu] = useState({
        visible: false,
        x: 0,
        y: 0,
        file: null
    });

    function handleRightClick(e, file) {
        e.preventDefault();
        setMenu({
            visible: true,
            x: e.clientX,
            y: e.clientY,
            file
        });
    };
    return (
        <div className={`table-container ${isRtl ? 'rtl' : 'ltr'}`}>
            <table className="files-table">
                <thead>
                    <tr>
                        <th>{isRtl ? "שם" : "Name"}</th>
                        <th>{isRtl ? "נפתח לאחרונה" : "Last opened"}</th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? (
                        <tr>
                            <td colSpan="4" className="status-msg">
                                {isRtl ? "טוען..." : "Loading..."}
                            </td>
                        </tr>
                    ) : items.length > 0 ? (
                        items.map(item => (
                            <tr key={item.id} className="file-row" onClick={() => openItem(item)} onContextMenu={(e) => handleRightClick(e, item)}>
                                <td className="col-name">
                                    <span className="file-icon">{item.type === 'folder' ? '📁' : '📄'}</span>
                                    {item.name}
                                </td>

                                <td className="col-date">
                                    {item.open ? new Date(item.open).toLocaleDateString(isRtl ? 'he-IL' : 'en-US', {
                                        day: '2-digit', month: '2-digit', year: 'numeric'
                                    }) : "--"}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="status-msg">
                                {isRtl ? "אין קבצים להצגה" : "No files to show"}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            <FileRightClickMenu menu={menu} setMenu={setMenu} items={items} setItems={setItems} isRTL={isRtl} />
        </div>

    );
}