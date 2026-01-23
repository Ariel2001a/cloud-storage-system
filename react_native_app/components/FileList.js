import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { getFiles } from '../api/files';
import FileCard from './FileCard';
import FileContentModal from './FileContentModal';
import { getFileContent } from '../api/files';

export default function FileList() {
    const { theme } = useTheme();
    const { t } = useLanguage();
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleFilePress = (item) => {
        if (item.type === 'file') {
            setSelectedFile({ ...item, content: 'Loading...' });
            setIsModalVisible(true);
            const realContent = getFileContent(item.id);
            setSelectedFile(prev => ({ ...prev, content: realContent }));

        } else if (item.type === 'folder') {
            console.log("נלחצה תיקייה:", item.name);
        }
    };

    const fetchFiles = async () => {
        setLoading(true);
        try {
            const data = await getFiles();
            setFiles(data);
        } catch (error) {
            console.error("Error fetching files:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFiles();
    }, []);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <View style={{ flex: 1, width: '100%' }}>
            <FlatList
                data={files}
                keyExtractor={item => item.id.toString()}
                style={{ width: '100%' }}
                contentContainerStyle={{ paddingBottom: 100, paddingTop: 20 }}
                onRefresh={fetchFiles}
                refreshing={loading}
                renderItem={({ item }) => (
                    <FileCard
                        item={item}
                        onPress={() => handleFilePress(item)}
                    />
                )}
                ListEmptyComponent={
                    <View style={{ marginTop: 50, alignItems: 'center' }}>
                        <Text style={{ color: theme.colors.textSub }}>
                            {t('noFilesFound')}
                        </Text>
                    </View>
                }
            />

            <FileContentModal
                visible={isModalVisible}
                file={selectedFile}
                onClose={() => setIsModalVisible(false)}
            />
        </View>
    );
}