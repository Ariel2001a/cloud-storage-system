import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    // ===== Sidebar =====
    sidebar: {
        width: 200,
        padding: 16,
        backgroundColor: '#f8f9fa',
    },
    dark_sidebar: {
        backgroundColor: '#1b1b1b',
    },
    sidebarButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginVertical: 4,
        borderRadius: 12,
        backgroundColor: '#fff',
        fontSize: 15,
    },

    newButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        paddingHorizontal: 24,
        marginBottom: 16,
        borderRadius: 16,
        backgroundColor: '#fff',
    },


});