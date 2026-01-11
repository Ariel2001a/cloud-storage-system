import { jwtDecode } from "jwt-decode";


/**
 * Grabs the token from sessionStorage and decodes it.
 * Returns the full JSON object (payload) or null if no token exists.
 */
export const getDecodedToken = () => {
    const token = sessionStorage.getItem('token');
    if (!token) {
        return null;
    }

    try {
        // This turns the string "eyJhbGci..." into a JSON object
        return jwtDecode(token);
    } catch (error) {
        console.error("Invalid token format:", error);
        return null;
    }
};
/**
 * Specifically returns the user ID from the token.
 */
export const getUserIdFromToken = () => {
    const decoded = getDecodedToken();
    return decoded ? decoded.id : null;
};
/**
 * Specifically returns the username from the token.
 */
export const getUsernameFromToken = () => {
    const decoded = getDecodedToken();
    return decoded ? decoded.username : null;
};