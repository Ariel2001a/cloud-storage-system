import React, { useState, useEffect } from 'react';
import { Modal, View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { getFileContentStyles } from '../styles/FileContentModal.styles';
import EditFileForm from './forms/EditFileForm';

export default function FileContentModal({ visible, file, onClose, onEdit }) {
    const { theme } = useTheme();
    const { locale } = useLanguage();
    const [editVisible, setEditVisible] = useState(false);
    
    // Local state for immediate UI updates
    const [displayedContent, setDisplayedContent] = useState("");

    // Initialize state when file loads
    useEffect(() => {
        if (file) {
            setDisplayedContent(file.content || "");
        }
    }, [file]);

    if (!file) return null;

    const styles = getFileContentStyles(theme);
    const isImage = file.name?.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/) || file.type === 'image';
    const HEADER_BG = theme.colors.surface || theme.colors.card;
    const HEADER_TEXT = theme.colors.textMain || theme.colors.text;
    const ICON_COLOR = theme.colors.primary;
    const isThemeDark = theme.dark || theme.mode === 'dark';
    
    // Use local displayedContent
    const contentString = String(displayedContent || "");

    const handleSave = (newContent) => {
        // Prevent setting blank/undefined if something goes wrong
        if (newContent !== undefined && newContent !== null) {
            setDisplayedContent(newContent);
            onEdit && onEdit(file.id, { content: newContent });
        }
        setEditVisible(false);
    };

    return (
        <>
            <Modal
                visible={visible}
                animationType="slide"
                presentationStyle="fullScreen"
                onRequestClose={onClose}
            >
                <StatusBar barStyle={isThemeDark ? "light-content" : "dark-content"} />
                <SafeAreaView style={{ flex: 0, backgroundColor: HEADER_BG }} />

                <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
                    <View style={[styles.header, {
                        backgroundColor: HEADER_BG,
                        flexDirection: locale === 'he' ? 'row-reverse' : 'row',
                        borderBottomColor: theme.colors.border
                    }]}>
                        <TouchableOpacity onPress={onClose} style={styles.iconButton}>
                            <Ionicons
                                name={locale === 'he' ? "arrow-forward" : "arrow-back"}
                                size={26}
                                color={ICON_COLOR}
                            />
                        </TouchableOpacity>

                        <Text style={[styles.headerTitle, { color: HEADER_TEXT }]} numberOfLines={1}>
                            {file.name}
                        </Text>

                        <TouchableOpacity
                            style={styles.iconButton}
                            onPress={() => setEditVisible(true)}
                        >
                            <Ionicons name="create-outline" size={24} color={ICON_COLOR} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView contentContainerStyle={styles.contentContainer}>
                        {isImage ? (
                            contentString ? (
                                <Image
                                    source={{
                                        uri: contentString.startsWith('/uploads')
                                            ? `http://10.0.2.2:8080${contentString}`
                                            : contentString.startsWith('data:')
                                                ? contentString
                                                : `data:image/jpeg;base64,${contentString}`
                                    }}
                                    style={{ width: '100%', height: 400, resizeMode: 'contain', marginTop: 10 }}
                                />
                            ) : (
                                <View style={{ flex: 1, alignItems: 'center', marginTop: 50 }}>
                                    <Text style={{ color: '#000' }}> </Text>
                                </View>
                            )
                        ) : (
                            <Text style={{ color: '#000000', fontSize: 16 }}>
                                {contentString || ''}
                            </Text>
                        )}
                    </ScrollView>
                </View>
            </Modal>

            <EditFileForm
                visible={editVisible}
                // Pass displayedContent so the edit form always opens with the latest unsaved local changes if needed
                file={{ ...file, content: displayedContent }} 
                onCancel={() => setEditVisible(false)}
                onSave={handleSave}
                lang={locale}
            />
        </>
    );
}