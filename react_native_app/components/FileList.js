import { View, FlatList, ActivityIndicator, Text } from 'react-native';
import { useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useFiles } from './useFiles';
import FileCard from './FileCard';
import FolderView from './FolderView';
import FileContentModal from './FileContentModal';
import { DeviceEventEmitter } from 'react-native';

export default function FileList({ fetchData }) {
    const { theme } = useTheme();
    const { t } = useLanguage();
    const {
        files, loading, currentFolder, folderStack, selectedFile,
        isFileModalVisible, setIsFileModalVisible, navigateInto, navigateBack, fetchFiles, setFetchData
    } = useFiles();

    useEffect(() => {
        DeviceEventEmitter.emit("REFRESH_FILES");

        if (!fetchData) return;

        const initFetch = async () => {
            try {
                await setFetchData(fetchData);

                await fetchFiles();
            } catch (error) {
                console.error("Fetch failed:", error);
            }
        };

        initFetch();
    }, [fetchData]);
    /*useEffect(() => {
        DeviceEventEmitter.emit("REFRESH_FILES");
        if (!fetchData) return;
        (async () => {
            setFetchData(fetchData);
            await fetchFiles();
        })();
    }, [fetchData]);*/

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
                        {loading ? (
                            <ActivityIndicator color={theme.colors.primary} />
                        ) : (
                            <Text style={{ color: theme.colors.textSub }}>
                                {t('noFilesFound')}
                            </Text>
                        )}
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