// app/login.js
import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, Image, 
  StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform 
} from 'react-native';
import { useRouter } from 'expo-router';
import CardLogo from '../assets/logo.png'; // Use same logo as RegisterScreen
import styles from '../styles/Login.styles';

export default function LoginScreen() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // ===== Sign-in Handler =====
  const handleSignIn = async () => {
    if (!username || !password) {
      Alert.alert('Missing Fields', 'Please fill all fields');
      return;
    }

    let email = username;
    if (!username.endsWith("@ead.com")) {
      email = username + "@ead.com";
    }

    const data = { email, password };

    try {
      const res = await fetch('http://YOUR_SERVER_IP:8080/api/users/tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errText = await res.text();
        Alert.alert('Sign In Failed', errText);
        return;
      }

      const { token } = await res.json();
      // Store token using AsyncStorage or your state management
      // Example:
      // import AsyncStorage from '@react-native-async-storage/async-storage';
      // await AsyncStorage.setItem('token', token);

      Alert.alert('Success', 'Signed in successfully!', [
        { text: 'OK', onPress: () => router.replace('home') } // Replace with main app screen
      ]);
    } catch (err) {
      Alert.alert('Error', 'Could not connect to the server.');
      console.log(err);
    }
  };

  // ===== Navigate to Register =====
  const handleSignUp = () => {
    router.push('register'); // Using expo-router
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Image source={CardLogo} style={styles.logo} />
          <Text style={styles.mainHeadline}>Sign in to your account</Text>

          <View style={styles.signUpRow}>
            <Text style={styles.secondaryHeadline}>Don’t have an account?</Text>
            <TouchableOpacity onPress={handleSignUp}>
              <Text style={[styles.secondaryHeadline, { color: '#1a73e8', marginLeft: 5 }]}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Username or Email"
            value={username}
            autoCapitalize="none"
            onChangeText={setUsername}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            secureTextEntry
            onChangeText={setPassword}
          />

          <TouchableOpacity style={styles.signInBtn} onPress={handleSignIn}>
            <Text style={styles.signInBtnText}>Sign in</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

