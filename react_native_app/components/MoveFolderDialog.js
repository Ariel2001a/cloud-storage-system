import { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import { Dialog, Portal, Button, IconButton } from "react-native-paper";
import { getFiles, getFolderChildren } from "../api/files";

export default function MoveFolderDialog({visible, onClose, onMoveConfirm, file, isRtl}) {
  const idMyDrive = 0;

  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [items, setItems] = useState([]);
  const [folderStack, setFolderStack] = useState([null]);
  const [selectedFolderId, setSelectedFolderId] = useState(null);

  useEffect(() => {
    if (!visible) return;

    async function load() {
      try {
        if (currentFolderId === null) {
          setItems([
            {
              id: idMyDrive,
              name: isRtl ? "האחסון שלי" : "My Drive",
              type: "folder",
              isRoot: true
            }
          ]);
          return;
        }

        let children =
          currentFolderId === idMyDrive
            ? await getFiles()
            : await getFolderChildren(currentFolderId);

        setItems((children || []).filter(i => i.type === "folder"));
      } catch (e) {
        console.error(e);
        setItems([]);
      }
    }

    load();
  }, [currentFolderId, visible]);

  const goIntoFolder = folder => {
    setCurrentFolderId(folder.id);
    setFolderStack(prev => [...prev, folder.id]);
  };

  const goBack = () => {
    if (folderStack.length > 1) {
      const stack = [...folderStack];
      stack.pop();
      setFolderStack(stack);
      setCurrentFolderId(stack[stack.length - 1]);
    } else {
      onClose();
    }
  };

  const confirmMove = () => {
    if (
      selectedFolderId === null ||
      selectedFolderId === file.id ||
      (selectedFolderId === idMyDrive && file.folderParent == null)
    ) {
      Alert.alert(
        isRtl ? "שגיאה" : "Error",
        isRtl ? "לא נבחרה תיקייה חוקית" : "No valid folder selected"
      );
      return;
    }

    onMoveConfirm(selectedFolderId === idMyDrive ? null : selectedFolderId);
    onClose();
  };

  const renderItem = ({ item }) => {
    const disabled =
      item.id === file.id ||
      item.id === file.folderParent ||
      (item.id === idMyDrive && file.folderParent == null);

    return (
      <View
        style={{
          padding: 10,
          borderRadius: 6,
          backgroundColor:
            selectedFolderId === item.id ? "#cce5ff" : "transparent",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 6
        }}
      >
        <TouchableOpacity
          disabled={disabled}
          onPress={() => setSelectedFolderId(item.id)}
        >
          <Text style={{ color: disabled ? "#999" : "#000" }}>
            {item.name}
          </Text>
        </TouchableOpacity>

        <IconButton
          icon="chevron-right"
          disabled={item.id === file.id}
          onPress={() => goIntoFolder(item)}
        />
      </View>
    );
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onClose} style={{ maxHeight: "80%" }}>
        <Dialog.Title>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <IconButton icon="arrow-left" onPress={goBack} />
            <Text>
              {currentFolderId === null
                ? isRtl ? "תיקייה ראשית" : "Root"
                : isRtl ? "תיקייה" : "Folder"}
            </Text>
          </View>
        </Dialog.Title>

        <Dialog.Content>
          {items.length > 0 ? (
            <FlatList
              data={items}
              keyExtractor={i => i.id.toString()}
              renderItem={renderItem}
            />
          ) : (
            <Text style={{ textAlign: "center", marginTop: 10 }}>
              {isRtl ? "התיקייה ריקה" : "Folder is empty"}
            </Text>
          )}
        </Dialog.Content>

        <Dialog.Actions>
          <Button onPress={onClose}>
            {isRtl ? "ביטול" : "Cancel"}
          </Button>
          <Button onPress={confirmMove}>
            {isRtl ? "אשר העברה" : "Confirm Move"}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
