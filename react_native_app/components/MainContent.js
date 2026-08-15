import { Tabs } from 'expo-router';
import BottomTabs from '../app/BottomTabs.js';
import { View } from 'react-native';
import { styles } from '../styles/MainContent.styles.js';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { usePathname } from 'expo-router';


export default function MainContent() {
    const { theme } = useTheme();
    const { locale } = useLanguage();
    const pathname = usePathname();
    const isSpecialPage = pathname.includes('BinPage') || pathname.includes('Recent');



    return (
        <View style={[
            styles.mainContent,
            {
                backgroundColor: theme.colors.background,
                flexDirection: locale === 'he' ? 'row-reverse' : 'row'
            }
        ]}>
            <Tabs
                tabBar={(props) => !isSpecialPage ? <BottomTabs {...props} /> : null}
                screenOptions={{
                    headerShown: false,
                    sceneContainerStyle: { backgroundColor: 'transparent' },
                }}
            >
                <Tabs.Screen name="index" />
                <Tabs.Screen name="files" />
                <Tabs.Screen name="Recent" />
                <Tabs.Screen name="BinPage" />
            </Tabs>
        </View>
    );
}
