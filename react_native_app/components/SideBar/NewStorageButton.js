import { useState } from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { styles } from '../../styles/Siebar.styles.js';
import NewStorageMenu from './NewStorageMenu';
import FolderForm from '../forms/FolderForm';
import TextForm from '../forms/TextForm';
import ImageForm from '../forms/ImageForm';

export default function NewStorageButton({ onCreated }) {
    const { theme } = useTheme();
    const { t } = useLanguage();
    const [menuVisible, setMenuVisible] = useState(false);
    const [activeForm, setActiveForm] = useState(null);

    const handleSelectOption = (type) => {
        setMenuVisible(false);
        setTimeout(() => {
            setActiveForm(type);
        }, 300);
    };

    const handleFormClose = () => {
        setActiveForm(null);
        if (onCreated) onCreated();
    };

    return (
        <>
            <TouchableOpacity
                style={[styles.newButton, { backgroundColor: theme.colors.primary }]}
                onPress={() => setMenuVisible(true)}
            >
                <Ionicons name="add" size={24} color="#fff" />
                <Text style={styles.newButtonText}>{t('newStorage')}</Text>
            </TouchableOpacity>

            <NewStorageMenu
                visible={menuVisible}
                onClose={() => setMenuVisible(false)}
                onSelect={handleSelectOption}
            />

            <FolderForm
                visible={activeForm === 'folder'}
                onClose={handleFormClose}
            />

            <TextForm
                visible={activeForm === 'text'}
                onClose={handleFormClose}
            />

            <ImageForm
                visible={activeForm === 'image'}
                onClose={handleFormClose}
            />
        </>
    );
}