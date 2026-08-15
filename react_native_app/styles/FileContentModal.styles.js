import { StyleSheet } from 'react-native';

export const getFileContentStyles = (theme, isDark) => {
    const colors = {
        headerBg: isDark ? '#1A1A1A' : '#F8F8F8',
        containerBg: isDark ? '#121212' : '#FFFFFF',
        text: isDark ? '#FFFFFF' : '#000000',
        border: isDark ? '#333333' : '#E0E0E0',
    };

    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.containerBg,
        },
        header: {
            height: 64,
            backgroundColor: colors.headerBg,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 15,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
            elevation: 4,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 3,
        },
        headerTitle: {
            fontSize: 18,
            fontWeight: '600',
            color: colors.text,
            textAlign: 'center',
            flex: 1,
        },
        iconButton: {
            padding: 8,
            minWidth: 44,
        },
        contentContainer: {
            padding: 20,
            paddingBottom: 50,
        },
        contentText: {
            fontSize: 16,
            lineHeight: 24,
            color: colors.text,
        }
    });
};