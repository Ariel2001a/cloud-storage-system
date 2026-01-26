import { useState } from 'react';
import { Menu, IconButton, Dialog, Portal, TextInput, Button} from 'react-native-paper';
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
import { useLanguage } from '../context/LanguageContext';


export default function MenuOptions({ item, isTrash }) {
    const [visible, setVisible] = useState(false);
    const [renameVisible, setRenameVisible] = useState(false);
    const [shareVisible, setShareVisible] = useState(false);
    const [newName, setNewName] = useState(item.name);
    const [moveVisible, setMoveVisible] = useState(false);
    const { locale, t } = useLanguage();


    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    const trash = t('Movetobin');
    const starPage = item.starred ? t('RemovefromStarred') : t('AddtoStarred')

    const fixedDomain = '@ead.com';

    const actions = [
        { label: t('Rename'), onPress: () => { closeMenu(); setNewName(item.name); setRenameVisible(true); console.log('Rename', item.name); } },
        { label: starPage, onPress: () => { starOrUnstarFileOrPublic(item.id,"star"); closeMenu(); console.log('star/unstar', item.name); } },
        { label: t('Share'), onPress: () => { closeMenu(); setShareUsername(fixedDomain); setShareVisible(true); console.log('Share', item.name); } },
        { label: t('MoveFolder'), onPress: () => { closeMenu(); setMoveVisible(true); console.log('move', item.name); } },
        { label: trash, onPress: () => { closeMenu(); deleteFileOrFolder(item.id); console.log('delete', item.name); } }
    ];

    const actionsTrash = [
        { label: t('Restore'), onPress: () => { closeMenu(); restoreFileOrFolder(item.id); console.log('move', item.name); } },
        { label: t('DeleteForever'), onPress: () => { closeMenu(); deleteFileOrFolder(item.id); console.log('delete', item.name); } }
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
                onPressIn={openMenu}
                />
            }
            >
            {isTrash && actionsTrash.map((action, idx) => (
                <Menu.Item
                    key={idx}
                    onPress={action.onPress}
                    title={action.label}
                />
            ))}

            {!isTrash && actions.map((action, idx) => (
                <Menu.Item
                key={idx}
                onPress={action.onPress}
                title={action.label}
                />
            ))}
            </Menu>

            <Portal>
                <Dialog
                    visible={renameVisible}
                    onDismiss={() => setRenameVisible(false)}
                >
                    <Dialog.Title>{t('Rename')}</Dialog.Title>

                    <Dialog.Content>
                        <TextInput
                            value={newName}
                            onChangeText={setNewName}
                            autoFocus
                            placeholder = {t('newName')}
                        />
                    </Dialog.Content>

                    <Dialog.Actions>
                        <Button onPress={() => setRenameVisible(false)}>{t('Cancel')}</Button>
                        <Button onPress={async () => {
                                    await renameFileOrFolder(item.id, newName);
                                    setRenameVisible(false);
                                }}
                        >
                            {t('OK')}
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>

            <EmailPromptModal
                visible={shareVisible}
                file={item}
                onCancel={() => setShareVisible(false)}
                onSubmit={(email, permission) =>
                    shareFileOrFolder(item.id, email, permission)
                }
            />

            <MoveFolderDialog
                visible={moveVisible}
                file={item}
                onClose={() => setMoveVisible(false)}
                onMoveConfirm={(folderId) => moveFolder(item.id, folderId)}
            />     
        </>
    );
}
