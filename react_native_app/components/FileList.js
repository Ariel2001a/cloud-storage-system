import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/FileCard.styles.js';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

const DATA = [
    { id: '1', name: 'UI_Layout_v1.pdf', size: '2.5 MB' },
    { id: '2', name: 'Presentation.pptx', size: '1.2 MB' },
    { id: '3', name: 'Invoice_Jan.pdf', size: '850 KB' },
    { id: '4', name: 'Project_Plan.docx', size: '3.1 MB' },
    { id: '5', name: 'Budget_2023.xlsx', size: '1.5 MB' },
    { id: '6', name: 'Meeting_Notes.txt', size: '300 KB' },
    { id: '7', name: 'Design_Mockup.sketch', size: '4.2 MB' },
    { id: '8', name: 'Research_Data.csv', size: '2.8 MB' },
    { id: '9', name: 'Marketing_Strategy.pdf', size: '1.9 MB' },
    { id: '10', name: 'Team_Photo.jpg', size: '2.3 MB' },
];

export default function FileList() {
    const { theme } = useTheme();
    const { locale } = useLanguage();

    return (
        <FlatList
            data={DATA}
            keyExtractor={item => item.id}
            style={{ width: '100%' }}
            contentContainerStyle={{
                paddingBottom: 100,
                paddingTop: 20,
                alignItems: 'stretch'
            }}
            renderItem={({ item }) => (
                <TouchableOpacity style={[
                    styles.card,
                    {
                        backgroundColor: theme.colors.surface,
                        borderColor: theme.colors.glassBorder,
                        flexDirection: locale === 'he' ? 'row-reverse' : 'row'
                    }
                ]}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="document-text-outline" size={24} color={theme.colors.primary} />
                    </View>
                    <View style={[
                        styles.infoContainer,
                        { alignItems: locale === 'he' ? 'flex-end' : 'flex-start', marginHorizontal: 10 }
                    ]}>
                        <Text style={[styles.fileName, { color: theme.colors.textMain, textAlign: locale === 'he' ? 'right' : 'left' }]}>
                            {item.name}
                        </Text>
                        <Text style={[styles.fileDetails, { color: theme.colors.textSub, textAlign: locale === 'he' ? 'right' : 'left' }]}>
                            {item.size}
                        </Text>
                    </View>
                    <Ionicons name="ellipsis-vertical" size={20} color={theme.colors.textSub} />
                </TouchableOpacity>
            )}
        />
    );
}