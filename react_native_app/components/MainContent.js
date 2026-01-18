import { Tabs } from 'expo-router';
import BottomTabs from './BottomTabs';

export default function MainContent() {
    return (
        <Tabs
            tabBar={(props) => <BottomTabs {...props} />}
            screenOptions={{ headerShown: false }}
        >
            <Tabs.Screen name="index" />
            <Tabs.Screen name="files" />
        </Tabs>
    );
}