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
        const res = await fetch(`${API_BASE}/${folderId}/children`, {
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


export async function deleteFileOrFolder(userId, fileId) {
    const res = await fetch(`${API_BASE}/${fileId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "user-id": userId
        }
    });
    if (!res.ok) {
        const errText = await res.text();
        throw new Error("Failed to delete: " + errText);
    }
    const text = await res.text(); // קורא את הגוף כטקסט
    return text;
}


export async function renameFileOrFolder(userId, fileId, newName) {
    const res = await fetch(`${API_BASE}/${fileId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "user-id": userId
        },
        body: JSON.stringify({ name: newName })
    });

    if (!res.ok) {
        const errText = await res.text();
        throw new Error("Failed to rename: " + errText);
    }

    const text = await res.text(); // קורא את הגוף כטקסט
    return text;
}

export async function moveFolder(userId, fileId, folderId) {
    const res = await fetch(`${API_BASE}/${fileId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "user-id": userId
        },
        body: JSON.stringify({ parent_id: folderId })
    });
    
    if (!res.ok) {
        const errText = await res.text();
        throw new Error("Failed to move folder: " + errText);
    }

    const text = await res.text(); // קורא את הגוף כטקסט
    return text;
}


export async function starOrUnstarFile(userId, fileId) {
    const res = await fetch(`${API_BASE}/${fileId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "user-id": userId
        },
    });
    if (!res.ok) {
        const errText = await res.text();
        throw new Error("Failed to star/unstar: " + errText);
    }

    const text = await res.text(); // קורא את הגוף כטקסט
    return text;
}

export async function shareFileOrFolder(userId, fileId, sharedWithUserId, permission) {
    const res = await fetch(`${API_BASE}/${fileId}/permissions`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "user-id": userId
        },
        body: JSON.stringify({ shared_with_user_id: sharedWithUserId, permission: permission })

    });

    if (!res.ok) {
        const errText = await res.text();
        throw new Error("Failed to share file/folder: " + errText);
    }
    const text = await res.text(); // קורא את הגוף כטקסט
    return text;
}


export async function getDeletedFiles(userId) {
    const res = await fetch(`${API_BASE}/deleted`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "user-id": userId
        },
    });
    return await res.json();
}

export async function getSharedFiles(userId) {
    const res = await fetch(`${API_BASE}/shared`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "user-id": userId
        },
    });
    return await res.json();
}

export async function getStarredFiles(userId) {
    const res = await fetch(`${API_BASE}/starred`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "user-id": userId
        },
    });
    return await res.json();
}