import { StyleSheet } from 'react-native';
import { COLORS } from './Theme.js';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background || '#0f172a',
        alignItems: 'center',
        justifyContent: 'center',
    },
    welcomeText: {
        fontSize: 22,
        fontWeight: '700',
        color: COLORS.textMain || '#f1f5f9',
        textShadowColor: COLORS.primary || '#38bdf8',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
    }
});