import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    // ===== Top Bar =====
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        height: 64,
        backgroundColor: '#f8f9fa',
    },
    dark_topBar: {
        backgroundColor: '#1e1e1e',
    },

    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },

    logoImg: {
        height: 40,
        width: 40,
        resizeMode: 'contain',
    },
    // ===== Search =====
    searchInput: {
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 24,
        backgroundColor: '#eaf1fb',
        fontSize: 16,
        color: '#202124',
        marginHorizontal: 16,
    },
    dark_searchInput: {
        backgroundColor: '#2c2c2c',
        color: '#e8eaed',
    },


    themeToggleBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },

});