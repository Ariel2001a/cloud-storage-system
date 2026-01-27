import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/FileCard.styles.js';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import MenuOptions from './MenuOptions.js'
import { usePathname } from 'expo-router'
import { getUserDetails } from '../api/files.js'
import { useEffect, useState } from 'react';

export default function FileCard({ item, onPress }) {
    const { theme } = useTheme();
    const { locale, t } = useLanguage();
    const pathname = usePathname();


    let isHome = pathname === '/' || pathname === '/(tabs)' || pathname === '/(tabs)/' || pathname.includes('Home');
    let isSharePage = pathname.includes('ShareFiles');
    let isTrash = pathname.includes('BinPage')

    const [ownerEmail, setOwnerEmail] = useState(''); // 2. סטייט לאימייל

    useEffect(() => {
        // 3. פונקציה פנימית לשליפת הנתונים
        const fetchEmail = async () => {
            if (isSharePage && item.ownerId) {
                try {
                    const userDetails = await getUserDetails(item.ownerId);
                    if (userDetails && userDetails.email) {
                        setOwnerEmail(userDetails.email);
                    }
                } catch (error) {
                    console.error("Failed to fetch owner details:", error);
                }
            }
        };

        fetchEmail();
    }, [item.ownerId, isSharePage]); // ירוץ רק כשה-ID משתנה

    return (
        <TouchableOpacity
            onPress={onPress}
            style={[
                styles.card,
                {
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.glassBorder,
                    flexDirection: locale === 'he' ? 'row-reverse' : 'row'
                }
            ]}
        >
            <View style={styles.iconContainer}>
                <Ionicons
                    name={item.type === 'folder' ? "folder-outline" : item.type === 'image' ? "image-outline" : "document-text-outline"}
                    size={24}
                    color={theme.colors.primary}
                />
            </View>

            <View style={[
                styles.infoContainer,
                {
                    alignItems: locale === 'he' ? 'flex-end' : 'flex-start',
                    marginHorizontal: 10
                }
            ]}>
                <Text
                    numberOfLines={1}
                    style={[styles.fileName, { color: theme.colors.textMain, textAlign: locale === 'he' ? 'right' : 'left' }]}
                >
                    {item.name}
                </Text>
                {!isHome && !isSharePage && <Text style={[styles.fileDetails, { color: theme.colors.textSub, textAlign: locale === 'he' ? 'right' : 'left' }]}>
                    {item.type === 'file' || 'image' ? `${item.size || '0'} KB` : 'Folder'}
                </Text>}
                {isHome && (
                    <Text style={[styles.fileDetails, { color: theme.colors.textSub, textAlign: locale === 'he' ? 'right' : 'left' }]}>
                        {t("Lastopened")} {item.open ? new Date(item.open).toLocaleDateString(locale === 'he' ? 'he-IL' : 'en-US') : '--'}
                    </Text>
                )}

                {isSharePage && <Text style={[styles.fileDetails, { color: theme.colors.textSub, textAlign: locale === 'he' ? 'right' : 'left' }]}>
                    {t("Owner")}: {ownerEmail}
                </Text>}
            </View>

            <MenuOptions
                item={item}
                locale={locale}
                isTrash={isTrash}
                isShare={isSharePage}
                anchor={
                    <TouchableOpacity>
                        <Ionicons
                            name="ellipsis-vertical"
                            size={20}
                            color={theme.colors.textSub}
                        />
                    </TouchableOpacity>
                }
            />
        </TouchableOpacity>
    );
}