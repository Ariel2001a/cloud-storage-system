import { View, Text, Image } from 'react-native';
import { useState } from 'react';
import { styles } from '../styles/TopBar.styles.js';
import SearchBar from './SearchBar';
import ThemeToggle from './ThemeToggle';
import { TouchableOpacity } from 'react-native';

export default function TopBar({ onMenuPress }) {
    const [isDark, setIsDark] = useState(false);

    return (
        <View style={[styles.topBar, isDark && styles.dark_topBar]}>
            <View style={styles.logoContainer}>
                <Image source={require('../assets/logo.png')} style={styles.logoImg} />
                <Text style={{ color: isDark ? '#e8eaed' : '#202124', fontSize: 20 }}></Text>
            </View>
            <SearchBar isDark={isDark} />
            <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
            <TouchableOpacity onPress={onMenuPress} style={styles.menuButton}>
                <Text style={{ fontSize: 24 }}>☰</Text>
            </TouchableOpacity>
        </View>
    );
}