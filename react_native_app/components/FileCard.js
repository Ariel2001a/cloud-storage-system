
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/FileCard.styles.js';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

export default function FileCard({ item, onPress }) {
    const { theme } = useTheme();
    const { locale } = useLanguage();

    return (
        <TouchableOpacity
            onPress={onPress}
            style={[
                styles.card,
                {
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.glassBorder,
                    flexDirection: locale === 'he' ? 'row-reverse' : 'row'
                }
            ]}
        >
            <View style={styles.iconContainer}>
                <Ionicons
                    name={item.type === 'folder' ? "folder-outline" : item.type === 'image' ? "image-outline" : "document-text-outline"}
                    size={24}
                    color={theme.colors.primary}
                />
            </View>

            <View style={[
                styles.infoContainer,
                {
                    alignItems: locale === 'he' ? 'flex-end' : 'flex-start',
                    marginHorizontal: 10
                }
            ]}>
                <Text
                    numberOfLines={1}
                    style={[styles.fileName, { color: theme.colors.textMain, textAlign: locale === 'he' ? 'right' : 'left' }]}
                >
                    {item.name}
                </Text>
                <Text style={[styles.fileDetails, { color: theme.colors.textSub, textAlign: locale === 'he' ? 'right' : 'left' }]}>
                    {item.type === 'file' || 'image' ? `${item.size || '0'} KB` : 'Folder'}
                </Text>
            </View>

            <TouchableOpacity onPress={() => {/* open options- 3 dots*/ }}>
                <Ionicons name="ellipsis-vertical" size={20} color={theme.colors.textSub} />
            </TouchableOpacity>
        </TouchableOpacity>
    );
}