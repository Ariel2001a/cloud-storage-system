/*import { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, Pressable, Alert, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { getFormStyles } from '../../styles/FormStyles';

export default function ImageForm({ visible, onClose }) {
    const { theme } = useTheme();
    const { t } = useLanguage();
    const styles = getFormStyles(theme);
    const [image, setImage] = useState(null);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const takePhoto = async () => {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

        if (permissionResult.granted === false) {
            alert(t('cameraPermissionDenied'));
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
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

    return (
        <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
            <Pressable style={styles.overlay} onPress={onClose}>
                <View style={styles.modalContent}>
                    <Text style={[styles.title, { color: theme.text }]}>{t('uploadImage')}</Text>

                    <TouchableOpacity
                        style={[styles.input, { borderStyle: 'dashed', height: 150, justifyContent: 'center', alignItems: 'center', borderColor: theme.border }]}
                        onPress={showOptions}
                    >
                        {image ? (
                            <Image source={{ uri: image }} style={{ width: '100%', height: '100%', borderRadius: 10 }} />
                        ) : (
                            <>
                                <Ionicons name="camera" size={40} color={theme.placeholder} />
                                <Text style={{ color: theme.placeholder }}>{t('selectImage')}</Text>
                            </>
                        )}
                    </TouchableOpacity>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={onClose} style={styles.button}>
                            <Text style={{ color: theme.subtext }}>{t('cancel')}</Text>
                        </TouchableOpacity>
                        {image && (
                            <TouchableOpacity style={[styles.button, styles.submitButton]}>
                                <Text style={[styles.buttonText, { color: '#fff' }]}>{t('save')}</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </Pressable>
        </Modal>
    );
}*/



import { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, Pressable, Alert, Image, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { getFormStyles } from '../../styles/FormStyles';
import { createFileOrFolder } from '../../api/files'; // הוספתי לייבוא

export default function ImageForm({ visible, onClose, onCreated, parentId }) {
    const { theme } = useTheme();
    const { t } = useLanguage();
    const styles = getFormStyles(theme);
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false); // הוספתי State לטעינה

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.7, // הורדתי מעט איכות כדי שהקובץ לא יהיה כבד מדי לשרת
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const takePhoto = async () => {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

        if (permissionResult.granted === false) {
            alert(t('cameraPermissionDenied'));
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
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

    // הפונקציה החדשה ששולחת את התמונה לשרת
    const handleSubmit = async () => {
        if (!image) return;

        setLoading(true);
        try {
            // הופכים את קובץ התמונה ל-Base64
            const base64 = await FileSystem.readAsStringAsync(image, {
                encoding: 'base64',
            });

            // שולחים לשרת דרך ה-API הקיים שלך
            await createFileOrFolder({
                name: `IMG_${Date.now()}.jpg`,
                type: 'file',
                content: base64, // ה-Base64 נשלח כתוכן
                parentId: parentId || null
            });

            setImage(null);
            if (onCreated) onCreated(); // מרעננים את הרשימה
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

                    <TouchableOpacity
                        style={[styles.input, { borderStyle: 'dashed', height: 150, justifyContent: 'center', alignItems: 'center', borderColor: theme.border }]}
                        onPress={showOptions}
                        disabled={loading}
                    >
                        {image ? (
                            <Image source={{ uri: image }} style={{ width: '100%', height: '100%', borderRadius: 10 }} />
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
                                onPress={handleSubmit} // הוספתי את הקריאה לשמירה
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