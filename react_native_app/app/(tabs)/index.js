import { View } from 'react-native';
import { styles } from '../../styles/index.styles.js';
import FileList from '../../components/FileList';
import { useTheme } from '../../context/ThemeContext';

export default function NewsFeed() {
    const { theme } = useTheme();
    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <FileList />
        </View>
    );
}