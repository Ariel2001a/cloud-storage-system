import { View, Text, TouchableOpacity } from 'react-native';
import FileList from '../../components/FileList.js';
import { useTheme } from '../../context/ThemeContext.js';
import { Provider as PaperProvider, IconButton } from 'react-native-paper';
import { getDeletedFiles } from '../../api/files.js';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../../context/LanguageContext';

export default function BinPage() {
    const { theme } = useTheme();
    const { locale, t } = useLanguage();
    const router = useRouter();

    const isRTL = locale === 'he';

    return (
        <PaperProvider>
            <View style={{
                flexDirection: isRTL ? 'row-reverse' : 'row',
                alignItems: 'center',
                paddingTop: 15,
                paddingHorizontal: 20,
                paddingBottom: 15,
                backgroundColor: theme.colors.surface,
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
                elevation: 4,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            }}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: theme.colors.glassBorder,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Ionicons
                        name={isRTL ? "arrow-forward" : "arrow-back"}
                        size={24}
                        color={theme.colors.primary}
                    />
                </TouchableOpacity>
                <View style={{ flex: 1, marginHorizontal: 15 }}>
                    <Text style={{
                        fontSize: 22,
                        fontWeight: '800',
                        color: theme.colors.textMain,
                        textAlign: isRTL ? 'right' : 'left'
                    }}>
                        {t('trash')}
                    </Text>
                </View>
            </View>
            <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
                <FileList
                    fetchData={getDeletedFiles}
                    isTrash={true}
                    isStarPage={false}
                />
            </View>
        </PaperProvider>
    );
}