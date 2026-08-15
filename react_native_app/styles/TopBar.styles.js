import { StyleSheet } from 'react-native';
import { COLORS } from './Theme.js';

export const styles = StyleSheet.create({
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        height: 70,
        backgroundColor: COLORS.glass || 'rgba(15, 23, 42, 0.8)',
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border || 'rgba(56, 189, 248, 0.2)',

        shadowColor: COLORS.primary || "#38bdf8",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoImg: {
        height: 35,
        width: 35,
        resizeMode: 'contain',
    },
    searchContainer: {
        flex: 1,
        marginHorizontal: 12,
        backgroundColor: COLORS.glassLight || 'rgba(255, 255, 255, 0.05)',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: COLORS.border || 'rgba(56, 189, 248, 0.3)',
        height: 40,
        justifyContent: 'center',
        paddingHorizontal: 15,
    },

    searchInput: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 0,
    },
    menuButton: {
        padding: 8,
        borderRadius: 12,
        backgroundColor: COLORS.primary ? `${COLORS.primary}20` : 'rgba(56, 189, 248, 0.1)',
    }
});