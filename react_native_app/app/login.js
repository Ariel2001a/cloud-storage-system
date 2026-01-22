import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Image,
  Alert, ScrollView, KeyboardAvoidingView, Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import CardLogo from '../assets/logo.png'; // Your logo
import styles from '../styles/Login.styles';
import { useLanguage } from '../context/LanguageContext';


// ===== SERVER URL CONFIG =====
// Change this to switch between LAN, ngrok, or production
// Current placeholder: localhost
// Your PC LAN IP: 192.168.1.225

//const SERVER_URL = 'http://10.0.2.2:8080';  // Android emulator localhost
const SERVER_URL = 'http://10.0.2.2:8080';

export default function LoginScreen() {
  const router = useRouter();
  const { t, locale, switchLanguage } = useLanguage();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // ===== Sign-in Handler =====
  const handleSignIn = async () => {
    if (!username || !password) {
      Alert.alert(t('missingInfo'), t('fillAllFields'));
      return;
    }

    let email = username;
    if (!username.endsWith("@ead.com")) {
      email = username + "@ead.com";
    }

    const data = { email, password };

    try {
      const res = await fetch(`${SERVER_URL}/api/users/tokens`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errText = await res.text();
        Alert.alert(t('signInFailed'), errText);
        return;
      }

      const { token } = await res.json();
      await AsyncStorage.setItem('token', token);

      Alert.alert(t('success'), t('signedInSuccessfully'), [
        { text: 'OK', onPress: () => router.replace('(tabs)') }
      ]);

    } catch (err) {
      Alert.alert(t('error'), t('couldNotConnect'));
      console.log(err);
    }
  };

  const handleSignUp = () => {
    router.push('register');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>

        {/* ===== Language Toggle ===== */}
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 10 }}>
          <TouchableOpacity onPress={() => switchLanguage(locale === 'en' ? 'he' : 'en')} style={{ padding: 5 }}>
            <Text>{locale === 'en' ? 'עברית' : 'English'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.header}>
          <Image source={CardLogo} style={styles.logo} />
          <Text style={styles.mainHeadline}>{t('signInToAccount')}</Text>

          <View style={styles.signUpRow}>
            <Text style={styles.secondaryHeadline}>{t('dontHaveAccount')}</Text>
            <TouchableOpacity onPress={handleSignUp}>
              <Text style={[styles.secondaryHeadline, { color: '#1a73e8', marginLeft: 5 }]}>{t('signUp')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder={t('usernameOrEmail')}
            value={username}
            autoCapitalize="none"
            onChangeText={setUsername}
          />
          <TextInput
            style={styles.input}
            placeholder={t('password')}
            value={password}
            secureTextEntry
            onChangeText={setPassword}
          />

          <TouchableOpacity style={styles.signInBtn} onPress={handleSignIn}>
            <Text style={styles.signInBtnText}>{t('signIn')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
