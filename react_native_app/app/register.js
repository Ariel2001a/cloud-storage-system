// app/register.js
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Image,
  Alert, ScrollView, KeyboardAvoidingView, Platform
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import styles from '../styles/Register.styles';
import { useLanguage } from '../context/LanguageContext'; // <-- import hook



// ===== SERVER URL CONFIG =====
// Change this to switch between LAN, ngrok, or production
// Current placeholder: localhost
// Your PC LAN IP: 192.168.1.225

const SERVER_URL = 'http://10.0.2.2:8080';  // Android emulator localhost
//const SERVER_URL = 'http://192.168.1.75:8080';

const RegisterScreen = () => {
  const router = useRouter();
  const { t, locale, switchLanguage } = useLanguage(); // ✅ hook

  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [profileImage, setProfileImage] = useState(null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(t('error'), t('permissionDenied'));
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

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

    const data = {
      first_name: firstname,
      last_name: lastname,
      email: `${username}@ead.com`,
      password,
      image: profileImage || null,
    };

    try {
      const res = await fetch(`${SERVER_URL}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        Alert.alert(t('success'), t('registeredSuccessfully'), [
          { text: 'OK', onPress: () => router.push('login') }
        ]);
      } else {
        const errText = await res.text();
        Alert.alert(t('registrationFailed'), errText);
      }
    } catch (err) {
      Alert.alert(t('error'), t('couldNotConnect'));
      console.log(err);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* ===== Language Button ===== */}
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 10 }}>
          <TouchableOpacity
            onPress={() => switchLanguage(locale === 'en' ? 'he' : 'en')}
            style={{ padding: 5 }}
          >
            <Text>{locale === 'en' ? 'English' : 'עברית'}</Text>
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

          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.btn, styles.uploadBtn]} onPress={pickImage}>
              <Text style={styles.btnText}>{t('uploadPicture')}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.btn, styles.registerBtn]} onPress={handleRegister}>
              <Text style={[styles.btnText, { color: '#fff' }]}>{t('register')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {profileImage && (
          <View style={styles.imagePreviewContainer}>
            <Image source={{ uri: profileImage }} style={styles.previewImage} />
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;
