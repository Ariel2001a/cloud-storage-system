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

export default function MenuOptions({ item, isTrash, isStarPage, onRename, locale }) {
    const [visible, setVisible] = useState(false);
    const [renameVisible, setRenameVisible] = useState(false);
    const [shareVisible, setShareVisible] = useState(false);
    const [username, setShareUsername] = useState(false);
    const [newName, setNewName] = useState(item.name);
    const [moveVisible, setMoveVisible] = useState(false);

    
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    const trash = isTrash ? 'Restore' : 'Move to bin';
    const starPage = isStarPage ? 'remove from Starred' : 'Add to Starred'
    const fixedDomain = '@ead.com';

    const actions = [
        { label: 'Rename', onPress: () => { closeMenu(); setNewName(item.name); setRenameVisible(true); console.log('Rename', item.name); } },
        { label: starPage, onPress: () => { starOrUnstarFileOrPublic(item.id,"star"); closeMenu(); console.log('star/unstar', item.name); } },
        { label: 'Share', onPress: () => { closeMenu(); setShareUsername(fixedDomain); setShareVisible(true); console.log('Share', item.name); } },
        { label: 'Move Folder', onPress: () => { closeMenu(); setMoveVisible(true); console.log('move', item.name); } },
        { label: trash, onPress: () => { isTrash ? restoreFileOrFolder(item.id) : deleteFileOrFolder(item.id); closeMenu(); console.log('delete', item.name); } },
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
            {actions.map((action, idx) => (
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
                <Dialog.Title>Rename</Dialog.Title>

                <Dialog.Content>
                    <TextInput
                        value={newName}
                        onChangeText={setNewName}
                        autoFocus
                        placeholder="New name"
                    />
                </Dialog.Content>

                <Dialog.Actions>
                    <Button onPress={() => setRenameVisible(false)}>Cancel</Button>
                    <Button onPress={async () => {
                                const success = await renameFileOrFolder(item.id, newName);
                                onRename(item.id, success.name);
                                setRenameVisible(false);
                            }}
                    >
                        OK
                    </Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>

        <EmailPromptModal
            visible={shareVisible}
            file={item}
            isRtl={locale === "he"}
            onCancel={() => setShareVisible(false)}
            onSubmit={(email, permission) =>
                shareFileOrFolder(item.id, email, permission)
            }
        />

        <MoveFolderDialog
            visible={moveVisible}
            file={item}
            isRtl={locale === "he"}
            onClose={() => setMoveVisible(false)}
            onMoveConfirm={(folderId) => moveFolder(item.id, folderId)}
        />     
    </>
    );
}
