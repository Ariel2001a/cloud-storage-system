import { View, Text, Image, TouchableOpacity } from 'react-native';
import { styles } from '../styles/TopBar.styles.js';
import SearchBar from './SearchBar';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

export default function TopBar({ onMenuPress }) {
    const { theme } = useTheme();
    const { locale } = useLanguage();

    return (
        <View style={[
            styles.topBar,
            {
                backgroundColor: theme.colors.background,
                flexDirection: locale === 'he' ? 'row-reverse' : 'row'
            }
        ]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image
                    source={require('../assets/logo.png')}
                    style={styles.logoImg}
                />
                <Text style={{
                    color: theme.colors.textMain,
                    fontSize: 18,
                    fontWeight: '600',
                    marginLeft: 8
                }}>
                    Drive
                </Text>
            </View>

            <View style={styles.searchContainer}>
                <SearchBar />
            </View>

            <TouchableOpacity onPress={onMenuPress} style={styles.menuButton}>
                <Ionicons
                    name="grid-outline"
                    size={24}
                    color={theme.colors.primary}
                />
            </TouchableOpacity>
        </View>
    );
}