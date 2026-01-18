import { TextInput } from 'react-native';
import { useState } from 'react';
import { styles } from '../styles/TopBar.styles.js';

export default function SearchBar({ isDark }) {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <TextInput
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholder="Search"
            style={[styles.searchInput, isDark && styles.dark_searchInput]}
            placeholderTextColor={isDark ? '#aaa' : '#555'}
        />
    );
}