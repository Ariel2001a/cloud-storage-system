// src/api/files.js

const API_BASE = 'http://localhost:8080/api/files'; // כתובת ה־API שלך

// 1️⃣ הצגת קבצים ותיקיות (top-level)
export async function getFiles(userId) {
    try {
        const res = await fetch(`${API_BASE}`, {
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
        const res = await fetch(`${API_BASE}/${folderId}`, {
            headers: { 'user-id': userId }
        });
        if (!res.ok) throw new Error('Failed to fetch folder');
        const data = await res.json();
        // data.file.folderParent === parentId, אבל children לא מגיעים ישירות
        // צריך להשתמש ב־getFolderFiles API, אבל לפי הקוד שלך אין endpoint נפרד
        // לכן, נניח שה־children נשלחים בפיילד file.children (אם תוסיף)
        return data.file.children || []; // אם אין, אפשר לממש ב־mock
    } catch (err) {
        console.error(err);
        return [];
    }
}

// 3️⃣ פתיחת קובץ (content)
export async function getFileContent(userId, fileId) {
    try {
        const res = await fetch(`${API_BASE}/${fileId}`, {
            headers: { 'user-id': userId }
        });
        if (!res.ok) throw new Error('Failed to fetch file');
        const data = await res.json();
        // לפי הקוד שלך, content נשמר ב־C++ server => צריך לקרוא ל־content דרך socket
        // לצורך Frontend, אפשר להחזיר mock: data.file.content
        return data.file.content || '';
    } catch (err) {
        console.error(err);
        return '';
    }
}

// 4️⃣ יצירת קובץ או תיקייה   
export async function createFileOrFolder(userId, body) {
    const res = await fetch(`${API_BASE}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "user-id": userId
        },
        body: JSON.stringify(body)
    });
    return await res.json();
}

