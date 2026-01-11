// src/api/files.js

const API_BASE = 'http://localhost:8080/api/files';

// helper to get headers with token
function getAuthHeaders() {
    const token = sessionStorage.getItem('token');
    if (!token) throw new Error("No token found");
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
}





// 1️⃣ Get top-level files
export async function getFiles() {
    try {
        const res = await fetch(`${API_BASE}`, {
            headers: getAuthHeaders()
        });
        if (!res.ok) throw new Error('Failed to fetch files');
        const data = await res.json();
        return data.files || [];
    } catch (err) {
        console.error(err);
        return [];
    }
}

// 2️⃣ Get folder children
export async function getFolderChildren(folderId) {
    try {
        const res = await fetch(`${API_BASE}/${folderId}`, {
            headers: getAuthHeaders()
        });
        if (!res.ok) throw new Error('Failed to fetch folder');
        const data = await res.json();
        return data.file.children || [];
    } catch (err) {
        console.error(err);
        return [];
    }
}

// 3️⃣ Get file content
export async function getFileContent(fileId) {
    try {
        const res = await fetch(`${API_BASE}/${fileId}`, {
            headers: getAuthHeaders()
        });
        if (!res.ok) throw new Error('Failed to fetch file');
        const data = await res.json();
        return data.file.content || '';
    } catch (err) {
        console.error(err);
        return '';
    }
}

// 4️⃣ Create file or folder
export async function createFileOrFolder(body) {
    try {
        const res = await fetch(`${API_BASE}`, {
            method: "POST",
            headers: getAuthHeaders(), // includes Content-Type + Authorization
            body: JSON.stringify(body) // ✅ stringify your object
        });

        if (!res.ok) throw new Error('Failed to create file/folder');
        return await res.json();
    } catch (err) {
        console.error(err);
        return null;
    }
}