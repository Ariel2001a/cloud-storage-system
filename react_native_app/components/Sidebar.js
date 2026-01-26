import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { ScrollView, TouchableOpacity, Text, View } from 'react-native';
import { styles } from '../styles/Siebar.styles.js';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import SettingsView from './SettingsView';
import NewStorageButton from './SideBar/NewStorageButton';
import { DeviceEventEmitter } from 'react-native';

export default function Sidebar({ isOpen, onClose }) {
    const { theme } = useTheme();
    const { t } = useLanguage();
    const router = useRouter();
    const [isSettingsMode, setIsSettingsMode] = useState(false);
    const [currentFolderId, setCurrentFolderId] = useState(null);

    useEffect(() => {
        const subscription = DeviceEventEmitter.addListener('SET_PARENT_ID', (id) => {
            setCurrentFolderId(id);
        });
        return () => subscription.remove();
    }, []);

    if (!isOpen) return null;

    return (
        <View style={styles.fullScreenOverlay}>
            <TouchableOpacity
                style={styles.backdrop}
                onPress={() => { setIsSettingsMode(false); onClose(); }}
            />

            <View style={[styles.sidebarContainer, { backgroundColor: theme.colors.surface }]}>
                <ScrollView style={styles.sidebar}>
                    {isSettingsMode ? (
                        <SettingsView onBack={() => setIsSettingsMode(false)} />
                    ) : (
                        <>
                            <NewStorageButton
                                onCreated={onClose}
                                currentFolderId={currentFolderId}
                            />

                            <TouchableOpacity style={styles.sidebarButton} onPress={() => router.push('/(tabs)/Recent')}>
                                <Ionicons name="time-outline" size={20} color={theme.colors.primary} />
                                <Text style={[styles.buttonText, { color: theme.colors.textMain }]} >{t('recent')}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.sidebarButton} onPress={() => router.push('/(tabs)/BinPage')} >
                                <Ionicons name="trash-outline" size={20} color={theme.colors.primary} />
                                <Text style={[styles.buttonText, { color: theme.colors.textMain }]}>{t('trash')}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.sidebarButton} onPress={() => setIsSettingsMode(true)}>
                                <Ionicons name="settings-outline" size={20} color={theme.colors.primary} />
                                <Text style={[styles.buttonText, { color: theme.colors.textMain }]}>{t('settings')}</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </ScrollView>
            </View>
        </View>
    );
}