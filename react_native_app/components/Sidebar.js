import { ScrollView, TouchableOpacity, Text, View } from 'react-native';
import { styles } from '../styles/Siebar.styles.js';

export default function Sidebar({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <View style={styles.fullScreenOverlay}>
            <TouchableOpacity
                style={styles.backdrop}
                activeOpacity={1}
                onPress={onClose}
            />

            <View style={styles.sidebarContainer}>
                <ScrollView style={styles.sidebar}>
                    <TouchableOpacity style={styles.newButton}><Text>➕ New</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.sidebarButton}><Text>🏠 Home</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.sidebarButton}><Text>📁 My Drive</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.sidebarButton}><Text>⭐ Starred</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.sidebarButton}><Text>🗑 Trash</Text></TouchableOpacity>
                </ScrollView>
            </View>
        </View>
    );
}