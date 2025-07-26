import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { registerUser } from '@/src/api/auth';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const colorScheme = useColorScheme() ?? 'light';

  const handleRegister = async () => {
    // Basic validation
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      await registerUser(email, password, name);
      Alert.alert(
        'Registration Successful', 
        'Your account has been created successfully!',
        [{ text: 'OK', onPress: () => router.replace('/auth/login') }]
      );
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  const navigateToLogin = () => {
    router.push('/auth/login');
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <ThemedView style={styles.container}>
        <View style={styles.logoContainer}>
          <Image source={require('../../assets/images/fai.png')} style={styles.logo} resizeMode="contain" />
        </View>
        <ThemedText type="title" style={styles.title}>FERTIFY AI</ThemedText>
        <ThemedText style={styles.subtitle}>Create a new account</ThemedText>

        <View style={styles.formContainer}>
          <TextInput
            style={[styles.input, { borderColor: Colors[colorScheme].icon }]}
            placeholder="Full Name"
            placeholderTextColor={Colors[colorScheme].icon}
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={[styles.input, { borderColor: Colors[colorScheme].icon }]}
            placeholder="Email"
            placeholderTextColor={Colors[colorScheme].icon}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={[styles.input, { borderColor: Colors[colorScheme].icon }]}
            placeholder="Password"
            placeholderTextColor={Colors[colorScheme].icon}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TextInput
            style={[styles.input, { borderColor: Colors[colorScheme].icon }]}
            placeholder="Confirm Password"
            placeholderTextColor={Colors[colorScheme].icon}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          <TouchableOpacity 
            style={[styles.button, { backgroundColor: Colors[colorScheme].tint }]} 
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <ThemedText style={styles.buttonText}>Register</ThemedText>
            )}
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <ThemedText>Already have an account? </ThemedText>
            <TouchableOpacity onPress={navigateToLogin}>
              <ThemedText style={styles.loginText}>Login</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
  },
  formContainer: {
    width: '100%',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  loginText: {
    color: '#2e7d32',
    fontWeight: 'bold',
  },
});