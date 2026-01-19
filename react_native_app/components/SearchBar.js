import { TextInput } from 'react-native';
import { useState } from 'react';
import { styles } from '../styles/TopBar.styles.js';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

export default function SearchBar() {
    const [searchTerm, setSearchTerm] = useState('');
    const { theme } = useTheme();
    const { t } = useLanguage();

    return (
        <TextInput
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholder={t('search')}
            placeholderTextColor={theme.isDark ? '#94a3b8' : '#64748B'}
        />
    );
}

