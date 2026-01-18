import { TouchableOpacity, Text } from 'react-native';
import { styles } from '../styles/TopBar.styles.js';

export default function ThemeToggle({ isDark, onToggle }) {
    return (
        <TouchableOpacity style={styles.themeToggleBtn} onPress={onToggle}>
            <Text>{isDark ? '☀️' : '🌙'}</Text>
        </TouchableOpacity>
    );
}