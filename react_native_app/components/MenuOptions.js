import { useState } from 'react';
import { Menu, IconButton } from 'react-native-paper';
import {
  renameFileOrFolder,
  deleteFileOrFolder,
  shareFileOrFolder,
  moveFolder,
  restoreFileOrFolder,
  starOrUnstarFileOrPublic
} from '../api/files';

export default function MenuOptions({ item }) {
  const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const actions = [
    { label: 'Rename', onPress: () => { closeMenu(); console.log('Rename', item.name); } },
    { label: 'Add to Starred"', onPress: () => { starOrUnstarFileOrPublic(); closeMenu(); console.log('Delete', item.name); } },
    { label: 'Share', onPress: () => { shareFileOrFolder(); closeMenu(); console.log('Share', item.name); } },
    { label: 'Move Folder', onPress: () => { moveFolder(); closeMenu(); console.log('move', item.name); } },
    { label: 'Move to bin', onPress: () => { deleteFileOrFolder(); closeMenu(); console.log('Download', item.name); } },
  ];

  return (
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
  );
}
