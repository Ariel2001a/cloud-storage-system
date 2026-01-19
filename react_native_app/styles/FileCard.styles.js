import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 20,
        marginBottom: 12,
        width: '92%',
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    infoContainer: {
        flex: 1,
        marginLeft: 15,
    },
    fileName: {
        color: '#f1f5f9',
        fontSize: 16,
        fontWeight: '600',
    },
    fileDetails: {
        color: '#94a3b8',
        fontSize: 13,
        marginTop: 2,
    }
});