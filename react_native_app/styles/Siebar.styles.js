import { StyleSheet, Dimensions } from 'react-native';
import { COLORS } from './Theme.js';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
    fullScreenOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: width,
        height: height,
        zIndex: 1000,
    },
    backdrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    sidebarContainer: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 260,
        backgroundColor: COLORS.glass || 'rgba(15, 23, 42, 0.95)',
        borderRightWidth: 1,
        borderRightColor: COLORS.border || 'rgba(56, 189, 248, 0.3)',
        paddingTop: 50,
    },
    sidebar: {
        padding: 16,
    },

    newButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 20,
        backgroundColor: COLORS.primary || '#38bdf8',
        marginBottom: 30,
        shadowColor: COLORS.primary || '#38bdf8',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 8,
    },
    newButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        marginLeft: 8,
    },
    sidebarButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        marginVertical: 4,
        borderRadius: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
    },
    buttonText: {
        color: COLORS.textSub || '#94a3b8',
        fontSize: 15,
        marginLeft: 12,
        fontWeight: '500',
    },
});