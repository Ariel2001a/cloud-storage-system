import { useState, useEffect } from 'react';
import { ScrollView, TouchableOpacity, Text, View, Image, ActivityIndicator } from 'react-native';
import { styles } from '../styles/Siebar.styles.js';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import SettingsView from './SettingsView';
import NewStorageButton from './SideBar/NewStorageButton';
import { DeviceEventEmitter } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 1. Import your API functions
import { getUserDetails, API_BASE } from '../api/files';

export default function Sidebar({ isOpen, onClose }) {
    const { theme } = useTheme();
    const { t } = useLanguage();
    
    // States
    const [isSettingsMode, setIsSettingsMode] = useState(false);
    const [currentFolderId, setCurrentFolderId] = useState(null);
    
    // User Data States
    const [user, setUser] = useState({ email: '', username: '' });
    const [loadingUser, setLoadingUser] = useState(true);
    const [imageError, setImageError] = useState(false);

    // Calculate Server Root: "http://.../api" -> "http://..."
    const SERVER_ROOT = API_BASE.replace(/\/api\/?$/, '');

    // --- HELPER: Decode JWT without external libraries ---
    const decodeJwt = (token) => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
            );
            return JSON.parse(jsonPayload);
        } catch (e) {
            // Polyfill for React Native environments where atob is missing
            try {
                const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
                const str = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
                let output = '';
                for (let block, charCode, idx = 0, map = chars; str.charAt(idx | 0) || (map = '=', idx % 1); output += map.charAt(63 & block >> 8 - idx % 1 * 8)) {
                    charCode = str.charCodeAt(idx += 3 / 4);
                    if (charCode > 0xFF) throw new Error("'atob' failed: The string to be decoded is not correctly encoded.");
                    block = block << 8 | charCode;
                }
                return JSON.parse(output);
            } catch (err) {
                return null;
            }
        }
    };

    // --- LOAD USER LOGIC ---
    useEffect(() => {
        const loadUser = async () => {
            if (!isOpen) return; // Only load when sidebar opens
            
            setLoadingUser(true);
            setImageError(false); // Reset image error

            try {
                // 1. Get Token
                const token = await AsyncStorage.getItem('token');
                if (!token) return; // User not logged in

                // 2. Decode Token to get ID
                const decoded = decodeJwt(token);
                const userId = decoded?.id || decoded?.userId; // Adjust based on your JWT structure

                if (!userId) return;

                // 3. Fetch Full Details from API
                const userDetails = await getUserDetails(userId);
                
                if (userDetails) {
                     const username = userDetails.username || userDetails.email?.split('@')[0];
                     setUser({ ...userDetails, username });
                }

            } catch (error) {
                console.log("Failed to load user:", error);
            } finally {
                setLoadingUser(false);
            }
        };

        loadUser();
    }, [isOpen]);

    // Folder Event Listener
    useEffect(() => {
        const subscription = DeviceEventEmitter.addListener('SET_PARENT_ID', (id) => {
            setCurrentFolderId(id);
        });
        return () => subscription.remove();
    }, []);

    if (!isOpen) return null;

    // --- IMAGE URL BUILDER ---
    const getProfileImage = () => {
        // If we failed to load user or image previously, show default
        if (imageError || !user.username) {
            return `${SERVER_ROOT}/uploads/default.png`; 
        }
        // Show specific user image
        return `${SERVER_ROOT}/uploads/${user.username}.jpeg?t=${Date.now()}`;
    };

    return (
        <View style={styles.fullScreenOverlay}>
            <TouchableOpacity
                style={styles.backdrop}
                onPress={() => { setIsSettingsMode(false); onClose(); }}
            />

            <View style={[styles.sidebarContainer, { backgroundColor: theme.colors.surface }]}>
                <ScrollView style={styles.sidebar}>
                    
                    {/* ===== PROFILE SECTION (Added Here) ===== */}
                    <View style={{ alignItems: 'center', paddingVertical: 30, borderBottomWidth: 1, borderBottomColor: theme.colors.border, marginBottom: 15 }}>
                        {loadingUser ? (
                            <ActivityIndicator size="small" color={theme.colors.primary} />
                        ) : (
                            <>
                                <Image
                                    source={{ uri: getProfileImage() }}
                                    style={{ 
                                        width: 90, 
                                        height: 90, 
                                        borderRadius: 45, 
                                        marginBottom: 12,
                                        backgroundColor: '#e1e1e1',
                                        borderWidth: 2,
                                        borderColor: theme.colors.primary
                                    }}
                                    // If loading username.jpeg fails, switch to default
                                    onError={() => setImageError(true)}
                                />
                                <Text style={{ color: theme.colors.textMain, fontWeight: 'bold', fontSize: 16 }}>
                                    {user.email || "User"}
                                </Text>
                            </>
                        )}
                    </View>
                    {/* ======================================== */}

                    {isSettingsMode ? (
                        <SettingsView onBack={() => setIsSettingsMode(false)} />
                    ) : (
                        <>
                            <NewStorageButton
                                onCreated={onClose}
                                currentFolderId={currentFolderId}
                            />

                            <TouchableOpacity style={styles.sidebarButton}>
                                <Ionicons name="time-outline" size={22} color={theme.colors.primary} />
                                <Text style={[styles.buttonText, { color: theme.colors.textMain }]}>{t('recent')}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.sidebarButton}>
                                <Ionicons name="trash-outline" size={22} color={theme.colors.primary} />
                                <Text style={[styles.buttonText, { color: theme.colors.textMain }]}>{t('trash')}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.sidebarButton} onPress={() => setIsSettingsMode(true)}>
                                <Ionicons name="settings-outline" size={22} color={theme.colors.primary} />
                                <Text style={[styles.buttonText, { color: theme.colors.textMain }]}>{t('settings')}</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </ScrollView>
            </View>
        </View>
    );
}