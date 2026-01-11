// src/api/files.js

const API_BASE = 'http://localhost:8080/api'; // כתובת ה־API שלך

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
        const res = await fetch(`${API_BASE}/files`, {
            headers: getAuthHeaders()

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
        const res = await fetch(`${API_BASE}/files/${folderId}`, {
            headers: getAuthHeaders()
        });
        if (!res.ok) throw new Error('Failed to fetch folder');
        const data = await res.json();
        return data.files || [];
    } catch (err) {
        console.error(err);
        return [];
    }
}

// 3️⃣ Get file content
export async function getFileContent(fileId) {
    try {
        const res = await fetch(`${API_BASE}/files/${fileId}`, {
            headers: getAuthHeaders()
        });
        if (!res.ok) throw new Error('Failed to fetch file');
        const data = await res.json();
        return data.content || '';
      
    } catch (err) {
        console.error(err);
        return '';
    }

// 4️⃣ Create file or folder
export async function createFileOrFolder(body) {
    try {
        const res = await fetch(`${API_BASE}/files`, {
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

//CHANGE THIS FUNCTIONS
export async function searchFiles(userId, query) {
    if (!query || query.trim() === "") return [];

    try {
        const res = await fetch(`${API_BASE}/search/${encodeURIComponent(query)}`, {
            method: 'GET',
            headers: {
                'user-id': userId.toString()
            }
        });

        if (!res.ok) {
            console.error("Search failed with status:", res.status);
            return [];
        }

        const data = await res.json();
        console.log("Search results received:", data); // לבדיקה בקונסול

        // שינוי קריטי: השרת מחזיר filesList ולא files
        return data.filesList || [];

    } catch (err) {
        console.error("Search error:", err);
        return [];
    }
}

export async function getUserDetails(userId) {
    try {
        const res = await fetch(`${API_BASE}/users/${userId}`, {
            method: 'GET',
            headers: { 'user-id': userId.toString() }
        });
        if (!res.ok) throw new Error('Failed to fetch user');
        return await res.json();
    } catch (err) {
        console.error("User fetch error:", err);
        return null;
    }
}

