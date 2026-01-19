// app/register.js
import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, Image, 
  StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import styles from '../styles/Register.styles';




const RegisterScreen = () => {
  const router = useRouter(); // Expo Router navigation

  // ===== Form state =====
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [profileImage, setProfileImage] = useState(null);

  // ===== Handlers =====
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need camera roll permissions to make this work!');
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
    // 1. Mandatory Field Check
    if (!firstname || !lastname || !username || !password || !confirm) {
      Alert.alert('Missing Info', 'Please fill all fields');
      return;
    }

    // 2. Username Regex
    if (!/^[a-zA-Z0-9]+$/.test(username)) {
      Alert.alert('Error', 'Username must contain only English letters and numbers!');
      return;
    }

    // 3. Strict Password Validation
    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password)) {
      Alert.alert('Invalid Password', 'Password must be at least 8 characters and include at least 1 letter and 1 number');
      return;
    }

    // 4. Password Match Check
    if (password !== confirm) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    // 5. Prepare Data for backend
    const data = {
      first_name: firstname,
      last_name: lastname,
      email: `${username}@ead.com`,
      password,
      image: profileImage || null, // optional
    };

    try {
      const res = await fetch('http://YOUR_SERVER_IP:8080/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        Alert.alert('Success', 'Registered successfully!', [
          { text: 'OK', onPress: () => router.push('login') }
        ]);
      } else {
        const errText = await res.text();
        Alert.alert('Registration Failed', errText);
      }
    } catch (err) {
      Alert.alert('Error', 'Could not connect to the server.');
      console.log(err);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Image source={require('../assets/logo.png')} style={styles.logo} />
          <Text style={styles.mainHeadline}>Create a new account</Text>
          <TouchableOpacity onPress={() => router.push('login')}>
            <Text style={styles.secondaryHeadline}>Already have an account? Sign in</Text>
          </TouchableOpacity>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <TextInput style={styles.input} placeholder="First name" value={firstname} onChangeText={setFirstname} />
          <TextInput style={styles.input} placeholder="Last name" value={lastname} onChangeText={setLastname} />
          <TextInput style={styles.input} placeholder="Username" value={username} onChangeText={setUsername} autoCapitalize="none" />
          <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
          <TextInput style={styles.input} placeholder="Confirm password" value={confirm} onChangeText={setConfirm} secureTextEntry />

          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.btn, styles.uploadBtn]} onPress={pickImage}>
              <Text style={styles.btnText}>Upload Picture (Optional)</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.btn, styles.registerBtn]} onPress={handleRegister}>
              <Text style={[styles.btnText, { color: '#fff' }]}>Register</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Image Preview */}
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



