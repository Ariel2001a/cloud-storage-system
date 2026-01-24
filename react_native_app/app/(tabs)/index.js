import { View } from 'react-native';
import { styles } from '../../styles/index.styles.js';
import FileList from '../../components/FileList';
import { useTheme } from '../../context/ThemeContext';
import { Provider as PaperProvider } from 'react-native-paper';


export default function NewsFeed() {
    const { theme } = useTheme();
    return (
        <PaperProvider>
            <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
                <FileList />
            </View>
        </PaperProvider>
    );
}