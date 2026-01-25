import { View, TouchableOpacity, Text } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/BottomTabs.styles.js';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

export default function BottomTabs() {
    const { theme } = useTheme();
    const { t } = useLanguage();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('home');

    const tabs = [
        { id: 'home', label: t('home'), icon: 'home-outline', activeIcon: 'home'},
        { id: 'starred', label: t('starred'), icon: 'star-outline', activeIcon: 'star' },
        { id: 'shared', label: t('shared'), icon: 'people-outline', activeIcon: 'people' },
        { id: 'drive', label: t('drive'), icon: 'folder-outline', activeIcon: 'folder' },
    ];

    const tabScreens = {
        home: 'Home',
        starred: 'StarFilesPage',
        shared: 'ShareFiles',
        drive: 'MyDrive',
    };


    return (
        <View style={[styles.container, {
            backgroundColor: theme.colors.surface,
            borderTopColor: theme.colors.glassBorder
        }]}>
            {tabs.map((tab) => {
                const isFocused = activeTab === tab.id;

                return (
                    <TouchableOpacity
                        key={tab.id}
                        style={styles.tabItem}
                        onPress={() => {
                            setActiveTab(tab.id);
                            const path = tabScreens[tab.id];
                            if (path) router.push(path)
                        }}
                    >
                        <Ionicons
                            name={isFocused ? tab.activeIcon : tab.icon}
                            size={24}
                            color={isFocused ? theme.colors.primary : theme.colors.textSub}
                        />
                        <Text style={{
                            color: isFocused ? theme.colors.primary : theme.colors.textSub,
                            fontSize: 11,
                            marginTop: 4,
                            fontWeight: isFocused ? '700' : '400',
                            textShadowColor: isFocused && theme.isDark ? theme.colors.primary : 'transparent',
                            textShadowOffset: { width: 0, height: 0 },
                            textShadowRadius: isFocused && theme.isDark ? 5 : 0,
                        }}>
                            {tab.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}