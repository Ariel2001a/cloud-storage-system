import React from 'react';
import "./FileTable.css";

const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return "--";
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return "\u200e" + parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

export default function FileTable({ items, isLoading, isRtl, user, openItem }) {
    return (
        <div className={`table-container ${isRtl ? 'rtl' : 'ltr'}`}>
            <table className="files-table">
                <thead>
                    <tr>
                        <th>{isRtl ? "שם" : "Name"}</th>
                        <th>{isRtl ? "בעלים" : "Owner"}</th>
                        <th>{isRtl ? "שינוי אחרון" : "Last modified"}</th>
                        <th>{isRtl ? "גודל קובץ" : "File size"}</th>
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
                            <tr key={item.id} className="file-row" onClick={() => openItem(item)}>
                                <td className="col-name">
                                    <span className="file-icon">{item.type === 'folder' ? '📁' : '📄'}</span>
                                    {item.name}
                                </td>
                                <td className="col-owner">
                                    <div className="owner-info">
                                        <div className="owner-avatar-mini">
                                            {user?.first_name ? user.first_name[0].toUpperCase() : "U"}
                                        </div>
                                        <span>{isRtl ? "אני" : "me"}</span>
                                    </div>
                                </td>
                                <td className="col-date">
                                    {item.date ? new Date(item.date).toLocaleDateString(isRtl ? 'he-IL' : 'en-US', {
                                        day: '2-digit', month: '2-digit', year: 'numeric'
                                    }) : "--"}
                                </td>
                                <td className="col-size">
                                    {item.type === 'folder' ? '--' : formatFileSize(item.size)}
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
        </div>
    );
}