//import
import { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { getFormStyles } from '../../styles/FormStyles';
import { createFileOrFolder } from '../../api/files';
import { DeviceEventEmitter } from 'react-native'

export default function TextForm({ visible, onClose, onCreated, parentId }) {
    const { theme } = useTheme();
    const { t } = useLanguage();
    const styles = getFormStyles(theme);

    const [name, setName] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!name.trim()) return Alert.alert(t('error'), t('nameRequired'));
        setLoading(true);
        try {
            await createFileOrFolder({
                name: name.trim(),
                type: 'file',
                content: content,
                parentId: parentId || null
            });

            DeviceEventEmitter.emit("REFRESH_FILES");

            setName('');
            setContent('');
            if (onCreated) onCreated();
            onClose();
        } catch (error) {

            console.error("Submit Error Details:", error);

            const errorMessage = error.message || t('failedToCreate');

            Alert.alert(
                t('error'),
                errorMessage
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
            <Pressable style={styles.overlay} onPress={onClose}>
                <View style={styles.modalContent}>
                    <Text style={[styles.title, { color: theme.text }]}>
                        {t('newTextNote')}
                    </Text>

                    <TextInput
                        style={[styles.input, { color: theme.text, borderColor: theme.border }]}
                        placeholder={t('fileName')}
                        placeholderTextColor={theme.placeholder}
                        value={name}
                        onChangeText={setName}
                    />

                    <TextInput
                        style={[styles.input, { color: theme.text, borderColor: theme.border, height: 120 }]}
                        placeholder={t('writeSomething')}
                        placeholderTextColor={theme.placeholder}
                        multiline
                        textAlignVertical="top"
                        value={content}
                        onChangeText={setContent}
                    />

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={onClose} style={styles.button} disabled={loading}>
                            <Text style={{ color: theme.subtext }}>
                                {t('cancel')}
                            </Text>
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
                                    {t('save')}
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </Pressable>
        </Modal>
    );
}