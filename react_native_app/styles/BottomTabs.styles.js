import { StyleSheet } from 'react-native';
import { COLORS } from './Theme.js';

export default StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: 65,
        backgroundColor: COLORS.glass || 'rgba(15, 23, 42, 0.9)',
        borderRadius: 30,
        marginHorizontal: 20,
        position: 'absolute',
        bottom: 25,
        left: 0,
        right: 0,
        borderWidth: 1,
        borderColor: COLORS.border || 'rgba(255, 255, 255, 0.1)',

        shadowColor: COLORS.primary || "#38bdf8",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 15,

        justifyContent: 'space-around',
        alignItems: 'center',
    },
    tabItem: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        height: '100%',
    },
});