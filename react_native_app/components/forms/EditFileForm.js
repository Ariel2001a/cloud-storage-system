import React, { useState, useEffect } from 'react';
import { Modal, ScrollView, View, TextInput, TouchableOpacity, Text, ActivityIndicator, Alert } from 'react-native';
import { patchFileById } from '../../api/files';
import { useTheme } from '../../context/ThemeContext';

export default function EditFileForm({ visible, file, onSave, onCancel, lang }) {
    const { theme } = useTheme();
    const [name, setName] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);

    // Load file data when modal opens
    useEffect(() => {
        if (visible && file) {
            setName(file.name || "");
            setContent(file.content || "");
        }
    }, [visible, file]);

    const handleSubmit = async () => {
        if (!name.trim()) {
            Alert.alert(lang === "he" ? "שגיאה" : "Error", lang === "he" ? "שם הקובץ אינו יכול להיות ריק" : "File name cannot be empty");
            return;
        }

        setLoading(true);
        try {
            const updatedFile = await patchFileById(file.id, { name, content });

            onSave && onSave(file.id, { name: updatedFile.name, content: updatedFile.content });

            file.name = updatedFile.name;
            file.content = updatedFile.content;

            onCancel();
        } catch {
            Alert.alert(lang === "he" ? "שגיאה" : "Error", lang === "he" ? "עדכון נכשל" : "Update failed");
        } finally {
            setLoading(false);
        }
    };

    if (!visible || !file) return null;

    // Theme styles```
    const colors = theme.isDark
        ? { background: '#121212', text: '#eee', border: '#555', inputBg: '#1e1e1e', btnPrimary: '#2196F3', btnText: '#fff' }
        : { background: '#fff', text: '#000', border: '#ccc', inputBg: '#fff', btnPrimary: '#2196F3', btnText: '#fff' };

    return (
        <Modal visible={visible} animationType="slide" onRequestClose={onCancel}>
            <ScrollView style={{ flex: 1, backgroundColor: colors.background, padding: 15 }}>
                
                {/* File Name */}
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

                {/* File Content */}
                <View style={{ marginBottom: 20 }}>
                    <Text style={{ marginBottom: 5, color: colors.text }}>
                        {lang === "he" ? "תוכן" : "Content"}:
                    </Text>
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
                        autoFocus
                    />
                </View>

                {/* Actions */}
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
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
