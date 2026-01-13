import { createContext, useContext, useState, useEffect } from "react";
import { getDecodedToken } from "../utils/tokenUtils";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            setLoading(false);
            return;
        }

        const decoded = getDecodedToken();
        if (!decoded?.id) {
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(`http://localhost:8080/api/users/${decoded.id}`, {
                headers: { Authorization: token }
            });
            if (res.ok) {
                const data = await res.json();
                setUser(data);
            }
        } catch (err) {
            console.error("Failed to fetch user:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, fetchUser, loading }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);