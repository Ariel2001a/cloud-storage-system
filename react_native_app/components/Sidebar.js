import { useState } from 'react';
import { ScrollView, TouchableOpacity, Text, View } from 'react-native';
import { styles } from '../styles/Siebar.styles.js';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import SettingsView from './SettingsView';

export default function Sidebar({ isOpen, onClose }) {
    const { theme } = useTheme();
    const { t } = useLanguage();
    const [isSettingsMode, setIsSettingsMode] = useState(false);

    if (!isOpen) return null;

    const menuItems = [
        { label: t('recent'), icon: 'time-outline' },
        { label: t('trash'), icon: 'trash-outline' },
    ];

    return (
        <View style={styles.fullScreenOverlay}>
            <TouchableOpacity
                style={styles.backdrop}
                activeOpacity={1}
                onPress={() => {
                    setIsSettingsMode(false);
                    onClose();
                }}
            />

            <View style={[styles.sidebarContainer, { backgroundColor: theme.colors.surface }]}>
                <ScrollView style={styles.sidebar}>
                    {isSettingsMode ? (
                        <SettingsView onBack={() => setIsSettingsMode(false)} />
                    ) : (
                        <>
                            <TouchableOpacity style={[styles.newButton, { backgroundColor: theme.colors.primary }]}>
                                <Ionicons name="add" size={24} color="#fff" />
                                <Text style={styles.newButtonText}>{t('newStorage')}</Text>
                            </TouchableOpacity>

                            {menuItems.map((item, index) => (
                                <TouchableOpacity key={index} style={styles.sidebarButton}>
                                    <Ionicons name={item.icon} size={20} color={theme.colors.primary} />
                                    <Text style={[styles.buttonText, { color: theme.colors.textMain }]}>
                                        {item.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}

                            <TouchableOpacity
                                style={styles.sidebarButton}
                                onPress={() => setIsSettingsMode(true)}
                            >
                                <Ionicons name="settings-outline" size={20} color={theme.colors.primary} />
                                <Text style={[styles.buttonText, { color: theme.colors.textMain }]}>
                                    {t('settings')}
                                </Text>
                            </TouchableOpacity>
                        </>
                    )}
                </ScrollView>
            </View>
        </View>
    );
}