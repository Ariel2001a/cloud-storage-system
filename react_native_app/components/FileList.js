import { View, FlatList, ActivityIndicator, Text } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useFiles } from './useFiles';
import FileCard from './FileCard';
import FolderView from './FolderView';
import FileContentModal from './FileContentModal';

export default function FileList() {
    const { theme } = useTheme();
    const { t } = useLanguage();
    const {
        files, loading, currentFolder, folderStack, selectedFile,
        isFileModalVisible, setIsFileModalVisible, navigateInto, navigateBack, fetchFiles
    } = useFiles();

    return (
        <View style={{ flex: 1, width: '100%' }}>
            <FolderView
                isVisible={folderStack.length > 0}
                folderName={currentFolder?.name}
                onBack={navigateBack}
            />

            <FlatList
                data={files}
                keyExtractor={item => item.id.toString()}
                onRefresh={fetchFiles}
                refreshing={loading}
                renderItem={({ item }) => (
                    <FileCard item={item} onPress={() => navigateInto(item)} />
                )}
                ListEmptyComponent={
                    <View style={{ marginTop: 50, alignItems: 'center' }}>
                        {loading ? <ActivityIndicator color={theme.colors.primary} />
                            : <Text style={{ color: theme.colors.textSub }}>{t('noFilesFound')}</Text>}
                    </View>
                }
            />

            <FileContentModal
                visible={isFileModalVisible}
                file={selectedFile}
                onClose={() => setIsFileModalVisible(false)}
            />
        </View>
    );
}