import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

export default function FolderView({ folderName, onBack, isVisible }) {
    const { theme } = useTheme();
    const { locale } = useLanguage();

    if (!isVisible) return null;

    return (
        <View style={{
            flexDirection: locale === 'he' ? 'row-reverse' : 'row',
            padding: 15,
            alignItems: 'center',
            backgroundColor: theme.colors.surface,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border
        }}>
            <TouchableOpacity onPress={onBack} style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons
                    name={locale === 'he' ? "arrow-forward" : "arrow-back"}
                    size={24}
                    color={theme.colors.primary}
                />
                <Text style={{ color: theme.colors.primary, fontWeight: 'bold', marginHorizontal: 8 }}>
                    {folderName}
                </Text>
            </TouchableOpacity>
        </View>
    );
}