import { View } from 'react-native';
import { styles } from '../../styles/tabs._layout.styles.js';
import TopBar from '../../components/TopBar.js';
import Sidebar from '../../components/Sidebar.js';
import MainContent from '../../components/MainContent.js';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TabsLayout() {
    return (
        <SafeAreaView style={styles.homeWrapper}>
            <TopBar />
            <View style={styles.mainLayout}>
                <Sidebar />
                <MainContent />
            </View>
        </SafeAreaView>
    );
}

