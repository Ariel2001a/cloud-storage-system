// src/api/files.js

const API_BASE = 'http://localhost:8080/api';

// helper to get headers with token
function getAuthHeaders() {
    const token = sessionStorage.getItem('token');
    if (!token) throw new Error("No token found");
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
}


export async function getLastOpenFiles() {
    try {
        const res = await fetch(`${API_BASE}/files/`, {
            headers: getAuthHeaders()
        });

        if (!res.ok) throw new Error('Failed to fetch files');
        const data = await res.json();
        console.log(data);
        return data.files || [];
    } catch (err) {
        console.error(err);
        return [];
    }
}


// 1️⃣ Get top-level files
export async function getFiles() {
    try {
        const res = await fetch(`${API_BASE}/files/myDrive`, {
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
        const res = await fetch(`${API_BASE}/files/${folderId}/children`, {
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
}

// 4️⃣ Create file or folder
export async function createFileOrFolder(body) {
    const res = await fetch(`${API_BASE}/files`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(body)
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to create file/folder');
    }

    return await res.json();
}
//CHANGE THIS FUNCTIONS
export async function searchFiles(query) {
    if (!query || query.trim() === "") return [];

    try {
        const res = await fetch(`${API_BASE}/search/${encodeURIComponent(query)}`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        if (!res.ok) {
            console.error("Search failed with status:", res.status);
            return [];
        }

        const data = await res.json();
        console.log("Search results received:", data);


        return data.files || [];

    } catch (err) {
        console.error("Search error:", err);
        return [];
    }
}

export async function getUserDetails(userId) {
    try {
        const res = await fetch(`${API_BASE}/users/${userId}`, {
            method: 'GET',
            headers: getAuthHeaders()
        });
        if (!res.ok) throw new Error('Failed to fetch user');
        return await res.json();
    } catch (err) {
        console.error("User fetch error:", err);
        return null;
    }
}


export async function deleteFileOrFolder(fileId) {
    const res = await fetch(`${API_BASE}/files/${fileId}`, {
        method: "DELETE",
        headers: getAuthHeaders()
    });
    if (!res.ok) {
        const errText = await res.text();
        throw new Error("Failed to delete: " + errText);
    }
    const text = await res.text();
    return text;
}


export async function restoreFileOrFolder(fileId) {
    const res = await fetch(`${API_BASE}/files/deleted/${fileId}`, {
        method: "POST",
        headers: getAuthHeaders()
    });
    if (!res.ok) {
        const errText = await res.text();
        throw new Error("Failed to delete: " + errText);
    }
    const text = await res.text();
    return text;
}

export async function renameFileOrFolder(fileId, newName) {
    const res = await fetch(`${API_BASE}/files/${fileId}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ name: newName })
    });

    if (!res.ok) {
        const errText = await res.text();
        throw new Error("Failed to rename: " + errText);
    }

    const text = await res.text();
    return text;
}

export async function moveFolder(fileId, folderId) {
    const res = await fetch(`${API_BASE}/files/${fileId}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ parentId: folderId })
    });

    if (!res.ok) {
        const errText = await res.text();
        throw new Error("Failed to move folder: " + errText);
    }

    const text = await res.text();
    return text;
}

export const patchFileById = async (id, body) => {
    const res = await fetch(`http://localhost:8080/api/files/${id}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        const errText = await res.text();
        throw new Error("Failed to edit file: " + errText);
    }

    // If backend returns no JSON, just return true
    return await res.json();
};

export async function starOrUnstarFileOrPublic(fileId, request) {
    const res = await fetch(`${API_BASE}/files/${fileId}`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ request: request })
    });
    if (!res.ok) {
        const errText = await res.text();
        throw new Error("Failed to star/unstar: " + errText);
    }

    const text = await res.text();
    return text;
}


export async function shareFileOrFolder(fileId, sharedWithUsername, permission) {

    console.log(fileId, sharedWithUsername, permission);
    const res = await fetch(`${API_BASE}/files/${fileId}/permissions`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ username: sharedWithUsername, permission: permission })

    });


    if (!res.ok) {
        const errText = await res.text();
        throw new Error("Failed to share file/folder: " + errText);
    }
    const text = await res.text();
    return text;
}

export async function checkPermission(username, fileId, permission) {

    console.log(fileId, permission);
    const res = await fetch(`${API_BASE}/files/${fileId}/permission?username=${username}&permission=${permission}`, {
        method: "GET",
        headers: getAuthHeaders(),

    });


    if (!res.ok) {
        const errText = await res.text();
        throw new Error("Failed to search permission" + errText);
    }
    const data = await res.json();
    console.log(data.allowed);
    return data.allowed;
}

export async function getDeletedFiles() {
    try {
        const res = await fetch(`${API_BASE}/files/deleted`, {
            method: "GET",
            headers: getAuthHeaders()
        });

        if (!res.ok) throw new Error('Failed to fetch files');
        const data = await res.json();
        console.log(data.files)
        return data.files || [];
    } catch (err) {
        console.error(err);
        return [];
    }
}


export async function getRecentFiles() {
    try {
        const res = await fetch(`${API_BASE}/files/recent`, {
            method: "GET",
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

export async function getSharedFiles() {
    try {
        const res = await fetch(`${API_BASE}/files/shared`, {
            method: "GET",
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

export async function getStarredFiles() {
    try {
        const res = await fetch(`${API_BASE}/files/starred`, {
            method: "GET",
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