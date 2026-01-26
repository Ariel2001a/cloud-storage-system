import React, { useState, useEffect } from 'react';
import { Modal, ScrollView, View, TextInput, TouchableOpacity, Text, ActivityIndicator, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { patchFileById } from '../../api/files';
import { useTheme } from '../../context/ThemeContext';

export default function EditFileForm({ visible, file, onSave, onCancel, lang }) {
    const { theme } = useTheme();
    const [name, setName] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);

    // Determine if the file is an image based on name or type
    const isImage = file?.name?.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/) || file?.type === 'image';

    useEffect(() => {
        if (visible && file) {
            setName(file.name || "");
            setContent(file.content || "");
        }
    }, [visible, file]);

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert(lang === "he" ? "שגיאה" : "Error", lang === "he" ? "נדרשת גישה לגלריה" : "Gallery permission required");
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.5,
            base64: true,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const asset = result.assets[0];
            const base64String = `data:${asset.mimeType || 'image/jpeg'};base64,${asset.base64}`;
            setContent(base64String);
        }
    };

    const removeImage = () => {
        setContent("");
    };

    const handleSubmit = async () => {
        if (!name.trim()) {
            Alert.alert(lang === "he" ? "שגיאה" : "Error", lang === "he" ? "שם הקובץ אינו יכול להיות ריק" : "File name cannot be empty");
            return;
        }

        setLoading(true);
        try {
            // Update both name and content on server
            await patchFileById(file.id, { name, content });
            
            // Update parent immediately with local state object
            onSave && onSave({ name, content });
            
            onCancel();
        } catch (error) {
            console.error(error);
            Alert.alert(lang === "he" ? "שגיאה" : "Error", lang === "he" ? "עדכון נכשל" : "Update failed");
        } finally {
            setLoading(false);
        }
    };

    if (!visible || !file) return null;

    // Theme styles
    const colors = theme.isDark
        ? { background: '#121212', text: '#eee', border: '#555', inputBg: '#1e1e1e', btnPrimary: '#2196F3', btnText: '#fff', danger: '#ff4444' }
        : { background: '#fff', text: '#000', border: '#ccc', inputBg: '#fff', btnPrimary: '#2196F3', btnText: '#fff', danger: '#ff4444' };

    const getImageSource = () => {
        if (!content) return null;
        if (content.startsWith('data:')) return { uri: content };
        if (content.startsWith('/uploads')) return { uri: `http://10.0.2.2:8080${content}` };
        return { uri: `data:image/jpeg;base64,${content}` };
    };

    return (
        <Modal visible={visible} animationType="slide" onRequestClose={onCancel}>
            <ScrollView style={{ flex: 1, backgroundColor: colors.background, padding: 15 }}>
                
                {/* File Name - Editable */}
                <View style={{ marginBottom: 15 }}>
                    <Text style={{ marginBottom: 5, color: colors.text }}>
                        {lang === "he" ? "שם קובץ" : "File Name"}:
                    </Text>
                    <TextInput
                        value={name}
                        onChangeText={setName}
                        style={{
                            borderWidth: 1,
                            borderColor: colors.border,
                            padding: 10,
                            borderRadius: 5,
                            backgroundColor: colors.inputBg,
                            color: colors.text,
                        }}
                    />
                </View>

                {/* Content Editor */}
                <View style={{ marginBottom: 20 }}>
                    <Text style={{ marginBottom: 5, color: colors.text }}>
                        {lang === "he" ? "תוכן" : "Content"}:
                    </Text>

                    {isImage ? (
                        // IMAGE UI
                        <View style={{ alignItems: 'center', borderWidth: 1, borderColor: colors.border, borderRadius: 5, padding: 10, backgroundColor: colors.inputBg }}>
                            {content ? (
                                <Image 
                                    source={getImageSource()} 
                                    style={{ width: '100%', height: 250, resizeMode: 'contain', marginBottom: 15 }} 
                                />
                            ) : (
                                <View style={{ height: 150, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ color: colors.text, opacity: 0.5 }}>
                                        {lang === "he" ? "אין תמונה" : "No Image Selected"}
                                    </Text>
                                </View>
                            )}
                            
                            <View style={{ flexDirection: 'row', gap: 10 }}>
                                <TouchableOpacity 
                                    onPress={pickImage} 
                                    style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.btnPrimary, padding: 10, borderRadius: 5 }}
                                >
                                    <Ionicons name="image-outline" size={20} color={colors.btnText} style={{ marginRight: 5 }} />
                                    <Text style={{ color: colors.btnText }}>
                                        {lang === "he" ? "בחר תמונה" : "Choose Image"}
                                    </Text>
                                </TouchableOpacity>

                                {content ? (
                                    <TouchableOpacity 
                                        onPress={removeImage} 
                                        style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.danger, padding: 10, borderRadius: 5 }}
                                    >
                                        <Ionicons name="trash-outline" size={20} color={colors.btnText} style={{ marginRight: 5 }} />
                                        <Text style={{ color: colors.btnText }}>
                                            {lang === "he" ? "מחק" : "Remove"}
                                        </Text>
                                    </TouchableOpacity>
                                ) : null}
                            </View>
                        </View>
                    ) : (
                        // TEXT UI
                        <TextInput
                            multiline
                            style={{
                                height: 250,
                                textAlignVertical: 'top',
                                borderWidth: 1,
                                borderColor: colors.border,
                                padding: 10,
                                borderRadius: 5,
                                backgroundColor: colors.inputBg,
                                color: colors.text,
                            }}
                            value={content}
                            onChangeText={setContent}
                        />
                    )}
                </View>

                {/* Actions */}
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 30 }}>
                    <TouchableOpacity onPress={onCancel} style={{ padding: 10, marginRight: 10 }}>
                        <Text style={{ color: colors.text }}>{lang === "he" ? "ביטול" : "Cancel"}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handleSubmit}
                        disabled={loading}
                        style={{ backgroundColor: colors.btnPrimary, padding: 10, borderRadius: 5 }}
                    >
                        {loading
                            ? <ActivityIndicator color={colors.btnText} />
                            : <Text style={{ color: colors.btnText }}>{lang === "he" ? "שמור" : "Save"}</Text>
                        }
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </Modal>
    );
}