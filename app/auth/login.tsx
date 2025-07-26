import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { signIn } from '@/src/api/auth';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const colorScheme = useColorScheme() ?? 'light';

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      await signIn(email, password);
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'Please check your credentials and try again');
    } finally {
      setLoading(false);
    }
  };

  const navigateToRegister = () => {
    router.push('/auth/register');
  };

  const navigateToForgotPassword = () => {
    router.push('/auth/forgot-password');
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('../../assets/images/fai.png')} style={styles.logo} resizeMode="contain" />
      </View>
      <ThemedText type="title" style={styles.title}>FERTIFY AI</ThemedText>
      <ThemedText style={styles.subtitle}>Login to your account</ThemedText>

      <View style={styles.formContainer}>
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

        <TouchableOpacity onPress={navigateToForgotPassword}>
          <ThemedText style={styles.forgotPassword}>Forgot Password?</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, { backgroundColor: Colors[colorScheme].tint }]} 
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <ThemedText style={styles.buttonText}>Login</ThemedText>
          )}
        </TouchableOpacity>

        <View style={styles.registerContainer}>
          <ThemedText>Don't have an account? </ThemedText>
          <TouchableOpacity onPress={navigateToRegister}>
            <ThemedText style={styles.registerText}>Register</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </ThemedView>
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
  forgotPassword: {
    textAlign: 'right',
    marginBottom: 24,
    color: '#2e7d32',
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
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  registerText: {
    color: '#2e7d32',
    fontWeight: 'bold',
  },
});