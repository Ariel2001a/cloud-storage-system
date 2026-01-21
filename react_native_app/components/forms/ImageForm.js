import { useState } from 'react';
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
}