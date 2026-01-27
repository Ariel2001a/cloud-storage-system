import { useState } from 'react';
import { DeviceEventEmitter } from 'react-native';
import { Menu, IconButton, Dialog, Portal, TextInput, Button } from 'react-native-paper';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

import {
    renameFileOrFolder,
    deleteFileOrFolder,
    shareFileOrFolder,
    moveFolder,
    restoreFileOrFolder,
    starOrUnstarFileOrPublic
} from '../api/files';

import EmailPromptModal from './EmailPromptModal';
import MoveFolderDialog from './MoveFolderDialog';

export default function MenuOptions({ item, isTrash, isShare }) {
    const [visible, setVisible] = useState(false);
    const [renameVisible, setRenameVisible] = useState(false);
    const [shareVisible, setShareVisible] = useState(false);
    const [newName, setNewName] = useState(item.name);
    const [moveVisible, setMoveVisible] = useState(false);
    const { locale, t } = useLanguage();
    const { theme } = useTheme();


    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    const executeAndRefresh = async (actionFn, successMsgKey, ...args) => {
        try {
            await actionFn(...args);
            DeviceEventEmitter.emit("REFRESH_FILES");
            DeviceEventEmitter.emit("SHOW_SNACKBAR", t(successMsgKey));

            closeMenu();
        } catch (error) {
            console.error("Action failed:", error);
            DeviceEventEmitter.emit("SHOW_SNACKBAR", t('action_failed'));
        }
    };

    const trashLabel = t('move_to_bin');
    const starLabel = item.starred ? t('remove_star') : t('add_star');

    const actions = [
        { label: t('rename'), onPress: () => { closeMenu(); setRenameVisible(true); } },
        { label: starLabel, onPress: () => executeAndRefresh(starOrUnstarFileOrPublic, 'status_updated', item.id, "star") },
        { label: t('share'), onPress: () => { closeMenu(); setShareVisible(true); } },
        { label: t('move_folder'), onPress: () => { closeMenu(); setMoveVisible(true); } },
        { label: trashLabel, onPress: () => executeAndRefresh(deleteFileOrFolder, 'moved_to_bin', item.id) }
    ];

    const actionsTrash = [
        { label: t('restore'), onPress: () => executeAndRefresh(restoreFileOrFolder, 'file_restored', item.id) },
        { label: t('delete_forever'), onPress: () => executeAndRefresh(deleteFileOrFolder, 'deleted_permanently', item.id) }
    ];

    const actionsShare = [
        { label: t('rename'), onPress: () => { closeMenu(); setRenameVisible(true); } },
        { label: t('share'), onPress: () => { closeMenu(); setShareVisible(true); } },
        { label: t('delete_forever'), onPress: () => executeAndRefresh(deleteFileOrFolder, 'deleted_permanently', item.id) }
    ];

    return (
        <>
            <Menu
                visible={visible}
                onDismiss={closeMenu}
                anchor={
                    <IconButton
                        icon="dots-vertical"
                        size={24}
                        onPress={openMenu}
                    />
                }
            >
                {(isTrash ? actionsTrash : isShare? actionsShare : actions).map((action, idx) => (
                    <Menu.Item key={idx} onPress={action.onPress} title={action.label} />
                ))}
            </Menu>

            <Portal>
                {/* Rename Dialog */}
                <Dialog visible={renameVisible} onDismiss={() => setRenameVisible(false)}>
                    <Dialog.Title>{t('rename')}</Dialog.Title>
                    <Dialog.Content>
                        <TextInput
                            value={newName}
                            onChangeText={setNewName}
                            autoFocus
                            placeholder={t('newName')}
                            style={{ textAlign: locale === 'he' ? 'right' : 'left' }}
                        />
                    </Dialog.Content>
                    <Dialog.Actions>


                        <Button onPress={() => setRenameVisible(false)}>{t('cancel')}</Button>
                        <Button onPress={() => {
                            executeAndRefresh(renameFileOrFolder, 'name_changed', item.id, newName);
                            setRenameVisible(false);
                        }}>{t('ok')}</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>

            <EmailPromptModal
                visible={shareVisible}
                file={item}
                onCancel={() => setShareVisible(false)}
                onSubmit={(email, permission) => {
                    executeAndRefresh(shareFileOrFolder, 'shared_success', item.id, email, permission);
                    setShareVisible(false);
                }}
            />

            <MoveFolderDialog
                visible={moveVisible}
                file={item}
                onClose={() => setMoveVisible(false)}
                onMoveConfirm={(folderId) => {
                    executeAndRefresh(moveFolder, 'moved_success', item.id, folderId);
                    setMoveVisible(false);
                }}
            />
        </>
    );
}
