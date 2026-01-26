import { View } from 'react-native';
import { styles } from '../../styles/tabs._layout.styles.js';
import TopBar from '../../components/TopBar.js';
import Sidebar from '../../components/Sidebar.js';
import MainContent from '../../components/MainContent.js';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { ThemeProvider, useTheme } from '../../context/ThemeContext';
import RequireAuth from '../../components/RequireAuth'; // ✅ import auth wrapper
import { Slot } from 'expo-router';
function TabsContent({ isMenuOpen, setIsMenuOpen }) {
    const { theme } = useTheme();

    return (
        <SafeAreaView style={[styles.homeWrapper, { backgroundColor: theme.colors.background }]}>
            <TopBar onMenuPress={() => setIsMenuOpen(!isMenuOpen)} />
            <View style={styles.mainLayout}>
                <MainContent />
                <Sidebar
                    isOpen={isMenuOpen}
                    onClose={() => setIsMenuOpen(false)}
                />
            </View>
        </SafeAreaView>
    );
}

export default function TabsLayout() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <ThemeProvider>
            <RequireAuth>
                <TabsContent isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
            </RequireAuth>
        </ThemeProvider>
    );
}

