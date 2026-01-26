// app/register.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import * as FileSystem from 'expo-file-system/legacy';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';

import styles from '../styles/Register.styles';
import { useLanguage } from '../context/LanguageContext';

// ===== SERVER URL =====
const SERVER_URL = 'http://10.0.2.2:8080';

export default function RegisterScreen() {
  const router = useRouter();
  const { t, locale, switchLanguage } = useLanguage();

  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const [profileImageUri, setProfileImageUri] = useState(null);
  const [profileImageBase64, setProfileImageBase64] = useState(null);

  // ===== HELPER: PROCESS IMAGE =====
  const processImage = async (uri) => {
    try {
      setProfileImageUri(uri);
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: 'base64',
      });
      const fullBase64 = `data:image/jpeg;base64,${base64}`;
      setProfileImageBase64(fullBase64);
    } catch (error) {
      console.error("Error processing image:", error);
      Alert.alert(t('error'), t('imageProcessingFailed'));
    }
  };

  // ===== PICK IMAGE (Gallery) =====
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      await processImage(result.assets[0].uri);
    }
  };

  // ===== TAKE PHOTO (Camera) =====
  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert(t('error'), t('cameraPermissionDenied'));
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      await processImage(result.assets[0].uri);
    }
  };

  // ===== SHOW OPTIONS (Menu) =====
  const showOptions = () => {
    Alert.alert(
      t('selectOption') || (locale === 'he' ? "בחר אפשרות" : "Select Option"),
      t('chooseSource') || (locale === 'he' ? "בחר מקור לתמונה" : "Choose a source for your profile picture"),
      [
        { text: t('camera') || (locale === 'he' ? "מצלמה" : "Camera"), onPress: takePhoto },
        { text: t('gallery') || (locale === 'he' ? "גלריה" : "Gallery"), onPress: pickImage },
        { text: t('cancel') || (locale === 'he' ? "ביטול" : "Cancel"), style: 'cancel' }
      ]
    );
  };

  // ===== REGISTER =====
  const handleRegister = async () => {
    if (!firstname || !lastname || !username || !password || !confirm) {
      Alert.alert(t('missingInfo'), t('fillAllFields'));
      return;
    }

    if (!/^[a-zA-Z0-9]+$/.test(username)) {
      Alert.alert(t('error'), t('usernameAlphanumeric'));
      return;
    }

    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password)) {
      Alert.alert(t('invalidPassword'), t('passwordRules'));
      return;
    }

    if (password !== confirm) {
      Alert.alert(t('error'), t('passwordsDoNotMatch'));
      return;
    }

    const payload = {
      first_name: firstname,
      last_name: lastname,
      email: `${username}@ead.com`,
      password,
      image: profileImageBase64,
    };

    try {
      const res = await fetch(`${SERVER_URL}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        Alert.alert(t('success'), t('registeredSuccessfully'), [
          { text: 'OK', onPress: () => router.push('login') },
        ]);
      } else {
        const text = await res.text();
        Alert.alert(t('registrationFailed'), text);
      }
    } catch (err) {
      console.error(err);
      Alert.alert(t('error'), t('couldNotConnect'));
    }
  };

  // Helper for Picture Text
  const getPictureText = () => {
    if (profileImageUri) {
      return locale === 'he' ? 'שנה תמונה' : 'Change Picture';
    }
    return locale === 'he' ? 'העלה תמונה' : 'Upload Picture';
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>

        {/* Language Toggle - Fixed Logic */}
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 10 }}>
          <TouchableOpacity onPress={() => switchLanguage(locale === 'en' ? 'he' : 'en')}>
            <Text style={{ fontSize: 16, fontWeight: '500', color: '#007AFF' }}>
              {locale === 'en' ? '🇮🇱 עברית' : '🇺🇸 English'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.header}>
          <Image source={require('../assets/logo.png')} style={styles.logo} />
          <Text style={styles.mainHeadline}>{t('createAccount')}</Text>
          <TouchableOpacity onPress={() => router.push('login')}>
            <Text style={styles.secondaryHeadline}>{t('alreadyHaveAccount')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <TextInput style={styles.input} placeholder={t('firstName')} value={firstname} onChangeText={setFirstname} />
          <TextInput style={styles.input} placeholder={t('lastName')} value={lastname} onChangeText={setLastname} />
          <TextInput style={styles.input} placeholder={t('username')} value={username} onChangeText={setUsername} autoCapitalize="none" />
          <TextInput style={styles.input} placeholder={t('password')} value={password} onChangeText={setPassword} secureTextEntry />
          <TextInput style={styles.input} placeholder={t('confirmPassword')} value={confirm} onChangeText={setConfirm} secureTextEntry />

          {/* Image Selection Area */}
          <View style={{ alignItems: 'center', marginVertical: 20 }}>
            <TouchableOpacity onPress={showOptions} style={{ alignItems: 'center' }}>
              {profileImageUri ? (
                <Image
                  source={{ uri: profileImageUri }}
                  style={{ width: 100, height: 100, borderRadius: 50, marginBottom: 15 }}
                />
              ) : (
                <View style={{
                  width: 100, height: 100, borderRadius: 50,
                  backgroundColor: '#e0e0e0', justifyContent: 'center', alignItems: 'center', marginBottom: 15
                }}>
                  <Text style={{ fontSize: 30, color: '#888' }}>📷</Text>
                </View>
              )}

              <Text style={{ color: '#007AFF', fontWeight: 'bold', marginTop: 5 }}>
                {t('uploadPicture') || getPictureText()}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Button Row - Centralized */}
          <View style={[styles.buttonRow, { justifyContent: 'center' }]}>
            <TouchableOpacity style={[styles.btn, styles.registerBtn, { width: '80%' }]} onPress={handleRegister}>
              <Text style={[styles.btnText, { color: '#fff', textAlign: 'center' }]}>{t('register')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}