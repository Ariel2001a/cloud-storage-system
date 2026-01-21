import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { styles } from '../styles/Siebar.styles.js';

export default function SettingsView({ onBack }) {
    const { theme, toggleTheme } = useTheme();
    const { t, locale, switchLanguage } = useLanguage();
    const router = useRouter();

    const handleSignOut = async () => {
        try {
            await AsyncStorage.removeItem('token'); // remove JWT
            router.replace('login'); // navigate to login
        } catch (err) {
            console.log(err);
            Alert.alert('Error', 'Could not sign out. Please try again.');
        }
    };

    return (
        <View>
            <TouchableOpacity onPress={onBack} style={{ marginBottom: 20, flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="arrow-back" size={24} color={theme.colors.primary} />
                <Text style={{ color: theme.colors.primary, marginLeft: 10, fontWeight: 'bold' }}>
                    {t('back')}
                </Text>
            </TouchableOpacity>

            <Text style={{ color: theme.colors.textSub, marginBottom: 15, fontSize: 12, fontWeight: '700', textTransform: 'uppercase' }}>
                {t('settings')}
            </Text>

            <TouchableOpacity
                style={styles.sidebarButton}
                onPress={() => switchLanguage(locale === 'en' ? 'he' : 'en')}
            >
                <Ionicons name="language-outline" size={20} color={theme.colors.primary} />
                <Text style={[styles.buttonText, { color: theme.colors.textMain }]}>
                    {t('language')}: {locale === 'en' ? 'English' : 'עברית'}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.sidebarButton} onPress={toggleTheme}>
                <Ionicons
                    name={theme.isDark ? "sunny-outline" : "moon-outline"}
                    size={20}
                    color={theme.colors.primary}
                />
                <Text style={[styles.buttonText, { color: theme.colors.textMain }]}>
                    {theme.isDark ? t('lightMode') : t('darkMode')}
                </Text>
            </TouchableOpacity>

            {/* ===== SIGN OUT BUTTON ===== */}
            <TouchableOpacity
                style={styles.sidebarButton}
                onPress={handleSignOut}
            >
                <Ionicons name="log-out-outline" size={20} color={theme.colors.primary} />
                <Text style={[styles.buttonText, { color: theme.colors.textMain }]}>
                    {t('signOut')}
                   
                </Text>
            </TouchableOpacity>
        </View>
    );
}
