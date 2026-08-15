import { TouchableOpacity, Text } from 'react-native';
import { useLanguage } from '../context/LanguageContext';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { styles } from '../styles/Siebar.styles.js';

export default function LangButton() {
  const { locale, switchLanguage } = useLanguage();
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      onPress={() => switchLanguage(locale === 'en' ? 'he' : 'en')}
      style={styles.sidebarButton}
    >
      <Ionicons name="language-outline" size={20} color={theme.colors.primary} />
      <Text style={[styles.buttonText, { color: theme.colors.textMain }]}>
        {locale === 'en' ? 'עברית' : 'English'}
      </Text>
    </TouchableOpacity>
  );
}