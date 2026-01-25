import { View } from 'react-native';
import { styles } from '../styles/index.styles.js';
import FileList from '../components/FileList.js';
import { useTheme } from '../context/ThemeContext.js';
import { Provider as PaperProvider } from 'react-native-paper';
import { getSharedFiles } from '../api/files.js';


export default function NewsFeed() {
    const { theme } = useTheme();
    return (
        <PaperProvider>
            <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
                <FileList fetchData={getSharedFiles} isTrash={false} isStarPage={false}/>
            </View>
        </PaperProvider>
    );
}