/*import { Modal, View, Text, ScrollView, TouchableOpacity, Pressable } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { getFormStyles } from '../styles/FormStyles';

export default function FileContentModal({ visible, file, onClose }) {
    const { theme } = useTheme();
    const { t } = useLanguage();
    const styles = getFormStyles(theme);

    if (!file) return null;

    return (
        <Modal transparent visible={visible} animationType="slide" onRequestClose={onClose}>
            <Pressable style={styles.overlay} onPress={onClose}>
                <View style={[styles.modalContent, { height: '80%', width: '90%' }]}>

                    <Text style={[styles.title, { color: theme.text, marginBottom: 10 }]}>
                        {file.name}
                    </Text>

                    <ScrollView
                        style={{
                            flex: 1,
                            backgroundColor: theme.background,
                            borderRadius: 10,
                            padding: 15,
                            borderWidth: 1,
                            borderColor: theme.border
                        }}
                    >
                        <Text style={{ color: theme.text, fontSize: 16, lineHeight: 24 }}>
                            {file.content || ''}
                        </Text>
                    </ScrollView>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            onPress={onClose}
                            style={[styles.button, styles.submitButton, { width: '100%' }]}
                        >
                            <Text style={[styles.buttonText, { color: '#fff' }]}>
                                {t('close') || 'Close'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Pressable>
        </Modal>
    );
}*/



import { Modal, View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { getFileContentStyles } from '../styles/FileContentModal.styles';

export default function FileContentModal({ visible, file, onClose }) {
    const { theme } = useTheme();
    const { locale } = useLanguage();

    // 1. קודם כל בודקים אם יש קובץ. אם אין - לא עושים כלום.
    if (!file) return null;

    // 2. רק עכשיו, כשבטוח שיש file, אפשר לגשת למאפיינים שלו
    const isImage = file.name?.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/) || file.type === 'image';
    const styles = getFileContentStyles(theme);

    // הגדרות צבע קבועות
    const HEADER_BG = '#1A1A1A';
    const HEADER_TEXT = '#FFFFFF';

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="fullScreen"
            onRequestClose={onClose}
        >
            <StatusBar barStyle="light-content" />
            <SafeAreaView style={{ flex: 0, backgroundColor: HEADER_BG }} />

            <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
                <View style={[styles.header, {
                    backgroundColor: HEADER_BG,
                    flexDirection: locale === 'he' ? 'row-reverse' : 'row'
                }]}>
                    <TouchableOpacity onPress={onClose} style={styles.iconButton}>
                        <Ionicons name={locale === 'he' ? "arrow-forward" : "arrow-back"} size={26} color={HEADER_TEXT} />
                    </TouchableOpacity>

                    <Text style={[styles.headerTitle, { color: HEADER_TEXT }]} numberOfLines={1}>
                        {file.name} {/* עכשיו זה בטוח */}
                    </Text>

                    <TouchableOpacity style={styles.iconButton}>
                        <Ionicons name="create-outline" size={24} color={HEADER_TEXT} />
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={styles.contentContainer}>
                    {isImage ? (
                        <Image
                            source={{ uri: `data:image/jpeg;base64,${file.content}` }}
                            style={{ width: '100%', height: 400, resizeMode: 'contain' }}
                        />
                    ) : (
                        <Text style={{ color: theme.colors.textMain, fontSize: 16 }}>
                            {file.content || ''}
                        </Text>
                    )}
                </ScrollView>
            </View>
        </Modal>
    );
}