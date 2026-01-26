import { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import {
  Dialog,
  Portal,
  TextInput,
  Button,
  Checkbox,
  Text,
} from "react-native-paper";
import { checkPermission, starOrUnstarFileOrPublic } from "../api/files";

export default function EmailPromptModal({ visible, file, onSubmit, onCancel, isRtl}) {

    const [username, setUsername] = useState("");
    const [permission, setPermission] = useState("read");
    const [isPublic, setIsPublic] = useState(false);
    let defaultDomain = "@ead.com";

    const labels = {
        read:  isRtl ? "קריאה" : "Read",
        write: isRtl ? "כתיבה" : "Write",
        owner: isRtl ? "העברת בעלות" : "Transfer ownership",
    };

    useEffect(() => {
        if (!file) return;
        setIsPublic(file.pub);
    }, [file]);

    const handleSubmit = async () => {
        if (!username.trim()) {
        alert(isRtl ? "הכנס שם משתמש" : "Enter username");
        return;
        }

        try {
        const fullEmail = `${username}${defaultDomain}`;

        if (permission === "write") {
            const canRead = await checkPermission(username, file.id, "read");
            if (!canRead) {
            await onSubmit(fullEmail, "read");
            }
        }

        const hasPermission = await checkPermission(username, file.id, permission);
        if (!hasPermission) {
            await onSubmit(fullEmail, permission);
        } else {
            alert(isRtl ? "ההרשאה כבר קיימת" : "Permission already exists");
        }

        if (isPublic && !file.pub) {
            await starOrUnstarFileOrPublic(file.id, "public");
        }

        setUsername("");
        setPermission("read");
        setIsPublic(false);
        onCancel();
        } catch (err) {
        console.error(err);
        alert(err.message);
        }
    };

    const isFolder = file?.type === "folder";

    return (
        <Portal>
        <Dialog visible={visible} onDismiss={onCancel}>
            <Dialog.Title>
            {isRtl ? "שיתוף" : "Share"} "{file?.name}"
            </Dialog.Title>

            <Dialog.Content>
            {/* Username + fixed domain */}
            <View style={styles.emailRow}>
                <TextInput
                value={username}
                onChangeText={setUsername}
                placeholder={isRtl ? "שם משתמש" : "Username"}
                style={styles.input}
                />
                <Text style={styles.domain}>{defaultDomain}</Text>
            </View>

            {/* Permission selector */}
            <Text style={styles.label}>
                {isRtl ? "הרשאה" : "Permission"}
            </Text>

            <View style={styles.permissionRow}>
                {["read", "write", "owner"].map(p => (
                    <Button
                    key={p}
                    mode={permission === p ? "contained" : "outlined"}
                    onPress={() => setPermission(p)}
                    style={styles.permissionBtn}
                    >
                    {labels[p]}
                    </Button>
                ))}
            </View>

            {/* Public checkbox */}
            {!file?.pub && (
            <Checkbox.Item
                label={isRtl ? "קובץ ציבורי" : "Make public"}
                status={isPublic ? "checked" : "unchecked"}
                onPress={() => setIsPublic(!isPublic)}
            />
            )}

            </Dialog.Content>

            <Dialog.Actions>
            <Button onPress={onCancel}>
                {isRtl ? "ביטול" : "Cancel"}
            </Button>
            <Button onPress={handleSubmit}>
                {isRtl ? "אישור" : "OK"}
            </Button>
            </Dialog.Actions>
        </Dialog>
        </Portal>
    );
}

const styles = StyleSheet.create({
    emailRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    input: {
        flex: 1,
    },
    domain: {
        marginLeft: 8,
        opacity: 0.6,
    },
    label: {
        marginTop: 10,
        marginBottom: 6,
    },
    permissionRow: {
        flexDirection: "row",
        gap: 6,
        marginBottom: 12,
    },
    permissionBtn: {
        flex: 1,
    },
    checkboxRow: {
        flexDirection: "row",
        alignItems: "center",
    },
});
