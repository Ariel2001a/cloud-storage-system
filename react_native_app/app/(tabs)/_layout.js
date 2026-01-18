import { View } from 'react-native';
import { styles } from '../../styles/tabs._layout.styles.js';
import TopBar from '../../components/TopBar.js';
import Sidebar from '../../components/Sidebar.js';
import MainContent from '../../components/MainContent.js';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';



export default function TabsLayout() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    return (
        <SafeAreaView style={styles.homeWrapper}>
            <TopBar onMenuPress={() => setIsMenuOpen(!isMenuOpen)} />
            <View style={styles.mainLayout}>
                <MainContent />
                <Sidebar
                    isOpen={isMenuOpen}
                    onClose={() => setIsMenuOpen(false)} />
            </View>
        </SafeAreaView>
    );
}

