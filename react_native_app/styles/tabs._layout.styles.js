import { StyleSheet } from 'react-native';
import { COLORS } from './Theme.js';

export const styles = StyleSheet.create({
    homeWrapper: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },

    // ===== Layout =====
    mainLayout: {
        flex: 1,
        flexDirection: 'row',
    },

    headerContainer: {
        backgroundColor: COLORS.accent,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    // ===== Avatar / Profile =====
    profileBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#1a73e8',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarLarge: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#1a73e8',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    userName: {
        fontSize: 18,
        fontWeight: '500',
        color: '#202124',
        textAlign: 'center',
    },
    userEmail: {
        fontSize: 14,
        color: '#5f6368',
        textAlign: 'center',
        marginBottom: 20,
    },

    // ===== Profile dropdown =====
    profileDropdown: {
        position: 'absolute',
        top: 52,
        right: 0,
        width: 280,
        padding: 20,
        borderRadius: 20,
        backgroundColor: '#fff',
        zIndex: 1000,
    },
    dark_profileDropdown: {
        backgroundColor: '#1e1e1e',
        color: '#e8eaed',
    },
});
