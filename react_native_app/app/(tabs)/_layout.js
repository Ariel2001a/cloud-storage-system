import { View } from 'react-native';
import { styles } from '../../styles/tabs._layout.styles.js';
import TopBar from '../../components/TopBar.js';
import Sidebar from '../../components/Sidebar.js';
import MainContent from '../../components/MainContent.js';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { ThemeProvider, useTheme } from '../../context/ThemeContext';
import RequireAuth from '../../components/RequireAuth'; // ✅ import auth wrapper
import { Snackbar } from 'react-native-paper';
import { DeviceEventEmitter } from 'react-native';

function TabsContent({ isMenuOpen, setIsMenuOpen }) {
    const { theme } = useTheme();
    const [snackbar, setSnackbar] = useState({ visible: false, message: '' })

    useEffect(() => {
        const subscription = DeviceEventEmitter.addListener('SHOW_SNACKBAR', (message) => {
            setSnackbar({ visible: true, message });
        });
        return () => subscription.remove();
    }, []);

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

            <Snackbar
                visible={snackbar.visible}
                onDismiss={() => setSnackbar({ ...snackbar, visible: false })}
                duration={3000}
                style={{
                    backgroundColor: '#323232',
                    borderRadius: 8,
                    marginBottom: 20
                }}
                action={{
                    label: 'OK',
                    onPress: () => setSnackbar({ visible: false, message: '' }),
                }}
            >
                {snackbar.message}
            </Snackbar>
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