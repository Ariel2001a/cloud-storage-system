import { View } from 'react-native';
import { styles } from '../styles/index.styles.js';
import FileList from '../components/FileList.js';
import { useTheme } from '../context/ThemeContext.js';
import { Provider as PaperProvider } from 'react-native-paper';
import { getRecentFiles } from '../api/files.js';


export default function Recent() {
    const { theme } = useTheme();
    return (
        <PaperProvider>
            <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
                <FileList fetchData={getRecentFiles} isTrash={false} isStarPage={false}/>
            </View>
        </PaperProvider>
    );
}