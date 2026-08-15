import { StyleSheet } from 'react-native';
import { COLORS } from './Theme.js';

export const styles = StyleSheet.create({
    homeWrapper: {
        flex: 1,
        backgroundColor: COLORS.background || '#020617',
    },
    mainLayout: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'transparent',
    },
    headerContainer: {
        backgroundColor: COLORS.glass || 'rgba(15, 23, 42, 0.8)',
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border || 'rgba(255, 255, 255, 0.1)',
    },
    profileBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: COLORS.primary || '#38bdf8',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarLarge: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.primary || '#38bdf8',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    userName: {
        fontSize: 18,
        fontWeight: '500',
        color: COLORS.textMain || '#f1f5f9',
        textAlign: 'center',
    },
    userEmail: {
        fontSize: 14,
        color: COLORS.textSub || '#94a3b8',
        textAlign: 'center',
        marginBottom: 20,
    },
    profileDropdown: {
        position: 'absolute',
        top: 52,
        right: 0,
        width: 280,
        padding: 20,
        borderRadius: 20,
        backgroundColor: COLORS.glass || 'rgba(15, 23, 42, 0.95)',
        borderWidth: 1,
        borderColor: COLORS.border || 'rgba(255, 255, 255, 0.1)',
        zIndex: 1000,
    }
});