import { View } from 'react-native';
import { Tabs } from 'expo-router';
import { styles } from '../styles/MainContent.styles.js';

export default function MainContent() {
    return (
        <View style={styles.mainContent}>
            <Tabs screenOptions={{ headerShown: false }}>
                <Tabs.Screen name="home" options={{ tabBarLabel: 'Home' }} />
                <Tabs.Screen name="create" options={{ tabBarLabel: 'Create' }} />
                <Tabs.Screen name="settings" options={{ tabBarLabel: 'Settings' }} />
            </Tabs>
        </View>
    );
}
