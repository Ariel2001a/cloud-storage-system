import { ScrollView, TouchableOpacity, Text } from 'react-native';
import { styles } from '../styles/Siebar.styles.js';

export default function Sidebar() {
    return (
        <ScrollView style={styles.sidebar}>
            <TouchableOpacity style={styles.newButton}><Text>➕ New</Text></TouchableOpacity>
            <TouchableOpacity style={styles.sidebarButton}><Text>🏠 Home</Text></TouchableOpacity>
            <TouchableOpacity style={styles.sidebarButton}><Text>📁 My Drive</Text></TouchableOpacity>
            <TouchableOpacity style={styles.sidebarButton}><Text>⭐ Starred</Text></TouchableOpacity>
            <TouchableOpacity style={styles.sidebarButton}><Text>🗑 Trash</Text></TouchableOpacity>
        </ScrollView>
    );
}
