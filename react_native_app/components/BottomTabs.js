import { View, TouchableOpacity, Text } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/BottomTabs.styles.js';

export default function BottomTabs() {
    const [activeTab, setActiveTab] = useState('home');
    const tabs = [
        { id: 'home', label: 'Home', icon: 'home-outline', activeIcon: 'home' },
        { id: 'starred', label: 'Starred', icon: 'star-outline', activeIcon: 'star' },
        { id: 'shared', label: 'Shared', icon: 'people-outline', activeIcon: 'people' },
        { id: 'drive', label: 'My Drive', icon: 'folder-outline', activeIcon: 'folder' },
    ];

    return (
        <View style={styles.container}>
            {tabs.map((tab) => {
                const isFocused = activeTab === tab.id;

                return (
                    <TouchableOpacity
                        key={tab.id}
                        style={styles.tabItem}
                        onPress={() => setActiveTab(tab.id)}
                    >
                        <Ionicons

                            name={isFocused ? tab.activeIcon : tab.icon}
                            size={24}

                            color={isFocused ? '#1a73e8' : '#5f6368'}
                        />
                        <Text style={{
                            color: isFocused ? '#1a73e8' : '#5f6368',
                            fontSize: 12,
                            marginTop: 4,
                            fontWeight: isFocused ? '600' : '400'
                        }}>
                            {tab.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}