// src/api/files.js

const API_BASE = 'http://localhost:8080/api'; // כתובת ה־API שלך

// 1️⃣ הצגת קבצים ותיקיות (top-level)
export async function getFiles(userId) {
    try {
        const res = await fetch(`${API_BASE}/files`, {
            headers: { 'user-id': userId }
        });
        if (!res.ok) throw new Error('Failed to fetch files');
        const data = await res.json();
        return data.files || [];
    } catch (err) {
        console.error(err);
        return [];
    }
}

// 2️⃣ פתיחת תיקייה (children)
export async function getFolderChildren(userId, folderId) {
    try {
        const res = await fetch(`${API_BASE}/files/${folderId}/children`, {
            headers: { 'user-id': userId }
        });
        if (!res.ok) throw new Error('Failed to fetch folder');
        const data = await res.json();

        return data.files || [];
    } catch (err) {
        console.error(err);
        return [];
    }
}

// 3️⃣ פתיחת קובץ (content)
export async function getFileContent(userId, fileId) {
    try {
        const res = await fetch(`${API_BASE}/files/${fileId}`, {
            headers: { 'user-id': userId }
        });
        if (!res.ok) throw new Error('Failed to fetch file');
        const data = await res.json();
        // לפי הקוד שלך, content נשמר ב־C++ server => צריך לקרוא ל־content דרך socket
        // לצורך Frontend, אפשר להחזיר mock: data.file.content
        return data.content || '';
    } catch (err) {
        console.error(err);
        return '';
    }
}

// 4️⃣ יצירת קובץ או תיקייה   
export async function createFileOrFolder(userId, body) {
    const res = await fetch(`${API_BASE}/files`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "user-id": userId
        },
        body: JSON.stringify(body)
    });
    return await res.json();
}

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

