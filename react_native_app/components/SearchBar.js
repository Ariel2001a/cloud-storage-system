import { TextInput } from 'react-native';
import { useState } from 'react';
import { styles } from '../styles/TopBar.styles.js';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { DeviceEventEmitter } from 'react-native';

export default function SearchBar() {
    const [searchTerm, setSearchTerm] = useState('');
    const { theme } = useTheme();
    const { t } = useLanguage();

    const handleChange = (text) => {
        setSearchTerm(text);
        DeviceEventEmitter.emit('SEARCH_FILES', text);
    };

    return (
        <TextInput
            value={searchTerm}
            onChangeText={handleChange}
            placeholder={t('search')}
            placeholderTextColor={theme.isDark ? '#94a3b8' : '#64748B'}
            style={[styles.searchInput, { color: theme.colors.textMain }]}
        />
    );
}

