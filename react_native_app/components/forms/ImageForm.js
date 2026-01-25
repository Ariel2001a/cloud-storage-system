import { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, Pressable, Alert, Image, ActivityIndicator, TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { getFormStyles } from '../../styles/FormStyles';
import { createFileOrFolder } from '../../api/files';
import { DeviceEventEmitter } from 'react-native'

export default function ImageForm({ visible, onClose, onCreated, parentId }) {
    const { theme } = useTheme();
    const { t } = useLanguage();
    const styles = getFormStyles(theme);
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fileName, setFileName] = useState('');
    const getDefaultName = () => `IMG_${Date.now()}`;

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            aspect: [4, 3],
            quality: 0.7,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
            if (!fileName) setFileName(getDefaultName());
        }
    };

    const takePhoto = async () => {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

        if (permissionResult.granted === false) {
            alert(t('cameraPermissionDenied'));
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: false,
            aspect: [4, 3],
            quality: 0.7,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const showOptions = () => {
        Alert.alert(
            t('selectOption'),
            t('chooseSource'),
            [
                { text: t('camera'), onPress: takePhoto },
                { text: t('gallery'), onPress: pickImage },
                { text: t('cancel'), style: 'cancel' }
            ]
        );
    };


    const handleSubmit = async () => {
        if (!image) return;

        setLoading(true);
        try {
            const base64 = await FileSystem.readAsStringAsync(image, {
                encoding: 'base64',
            });
            const fullBase64 = `data:image/jpeg;base64,${base64}`;

            await createFileOrFolder({
                name: fileName.trim().endsWith('.jpg') ? fileName.trim() : `${fileName.trim()}.jpg`,
                type: 'image',
                content: fullBase64,
                parentId: parentId || null
            });

            DeviceEventEmitter.emit("REFRESH_FILES");

            setImage(null);
            if (onCreated) onCreated();
            onClose();
        } catch (error) {
            console.error("Upload Error:", error);
            Alert.alert(t('error'), t('failedToCreate'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
            <Pressable style={styles.overlay} onPress={onClose}>
                <View style={styles.modalContent}>
                    <Text style={[styles.title, { color: theme.text }]}>{t('uploadImage')}</Text>

                    <TextInput
                        style={[styles.input, { color: theme.text, borderColor: theme.border, marginBottom: 15 }]}
                        placeholder={t('fileName')}
                        placeholderTextColor={theme.placeholder}
                        value={fileName}
                        onChangeText={setFileName}
                    />

                    <TouchableOpacity
                        style={[styles.input, { borderStyle: 'dashed', height: 150, justifyContent: 'center', alignItems: 'center', borderColor: theme.border }]}
                        onPress={showOptions}
                        disabled={loading}
                    >
                        {image ? (
                            <Image source={{ uri: image }} style={{ width: '100%', height: '100%', borderRadius: 10 }} resizeMode="contain" />
                        ) : (
                            <>
                                <Ionicons name="camera" size={40} color={theme.placeholder} />
                                <Text style={{ color: theme.placeholder }}>{t('selectImage')}</Text>
                            </>
                        )}
                    </TouchableOpacity>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={onClose} style={styles.button} disabled={loading}>
                            <Text style={{ color: theme.subtext }}>{t('cancel')}</Text>
                        </TouchableOpacity>
                        {image && (
                            <TouchableOpacity
                                style={[styles.button, styles.submitButton]}
                                onPress={handleSubmit}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#fff" size="small" />
                                ) : (
                                    <Text style={[styles.buttonText, { color: '#fff' }]}>{t('save') || t('create')}</Text>
                                )}
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </Pressable>
        </Modal>
    );
}