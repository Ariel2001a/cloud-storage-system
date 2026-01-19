import { TouchableOpacity, Text } from 'react-native';
import { styles } from '../styles/TopBar.styles.js';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();
    return (
        <TouchableOpacity style={styles.themeToggleBtn} onPress={toggleTheme}>
            <Text style={{ fontSize: 22 }}>
                {theme.isDark ? '☀️' : '🌙'}
            </Text>
        </TouchableOpacity>
    );
}