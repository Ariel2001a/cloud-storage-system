import { View, Text, TouchableOpacity, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { getStyles } from '../../styles/NewStorageMenu.styles';

export default function NewStorageMenu({ visible, onClose, onSelect }) {
    const { theme } = useTheme();
    const { t } = useLanguage();
    const styles = getStyles(theme);

    const options = [
        { id: 'folder', label: 'folder', icon: 'folder', color: '#4285F4' },
        { id: 'image', label: 'image', icon: 'image', color: '#EA4335' },
        { id: 'text', label: 'text', icon: 'document-text', color: '#FBBC05' },
    ];
    return (
        <Modal transparent visible={visible} animationType="slide" onRequestClose={onClose}>
            <Pressable style={styles.overlay} onPress={onClose}>
                <View style={styles.menuContainer}>
                    <Text style={styles.title}>{t('createNew')}</Text>

                    <View style={styles.optionsGrid}>
                        {options.map((item) => (
                            <TouchableOpacity
                                key={t(item.id)}
                                style={styles.optionButton}
                                onPress={() => {
                                    onSelect(item.id);
                                    onClose();
                                }}
                            >
                                <View style={[styles.iconCircle, { backgroundColor: item.color + '20' }]}>
                                    <Ionicons name={item.icon} size={28} color={item.color} />
                                </View>
                                <Text style={styles.optionLabel}>{t(item.label)}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </Pressable>
        </Modal>
    );
}