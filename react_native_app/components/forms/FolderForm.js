import { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { getFormStyles } from '../../styles/FormStyles.js';
import { createFileOrFolder } from '../../api/files';
import { DeviceEventEmitter } from 'react-native'

export default function FolderForm({ visible, onClose, onCreated, parentId }) {
    const { theme } = useTheme();
    const { t } = useLanguage();
    const styles = getFormStyles(theme);

    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!name.trim()) {
            return Alert.alert(t('error'), t('nameRequired'));
        }

        setLoading(true);
        try {
            await createFileOrFolder({
                name: name.trim(),
                type: 'folder',
                parentId: parentId || null
            });

            DeviceEventEmitter.emit("REFRESH_FILES");

            setName('');
            if (onCreated) onCreated();
            onClose();
        } catch (error) {
            console.error("Create Folder Error:", error);
            Alert.alert(t('error'), error.message || t('failedToCreate'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
            <Pressable style={styles.overlay} onPress={onClose}>
                <View style={styles.modalContent}>
                    <Text style={[styles.title, { color: theme.text }]}>
                        {t('newFolder')}
                    </Text>

                    <TextInput
                        style={[styles.input, { color: theme.text, borderColor: theme.border }]}
                        placeholder={t('folderName')}
                        placeholderTextColor={theme.placeholder}
                        value={name}
                        onChangeText={setName}
                        autoFocus
                    />

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            onPress={onClose}
                            style={styles.button}
                            disabled={loading}
                        >
                            <Text style={{ color: theme.subtext }}>{t('cancel')}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.button, styles.submitButton]}
                            onPress={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" size="small" />
                            ) : (
                                <Text style={[styles.buttonText, { color: '#fff' }]}>
                                    {t('create')}
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </Pressable>
        </Modal>
    );
}