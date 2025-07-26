/*import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { resetPassword } from '@/src/api/auth';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const colorScheme = useColorScheme() ?? 'light';

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email);
      Alert.alert(
        'Password Reset Email Sent', 
        'Please check your email for instructions to reset your password.',
        [{ text: 'OK', onPress: () => router.replace('/auth/login') }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to send password reset email');
    } finally {
      setLoading(false);
    }
  };

  const navigateToLogin = () => {
    router.push('/auth/login');
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('../../assets/images/fai.png')} style={styles.logo} resizeMode="contain" />
      </View>
      <ThemedText type="title" style={styles.title}>FERTIFY AI</ThemedText>
      <ThemedText style={styles.subtitle}>Reset Your Password</ThemedText>

      <View style={styles.formContainer}>
        <ThemedText style={styles.instructions}>
          Enter your email address and we'll send you instructions to reset your password.
        </ThemedText>
        
        <TextInput
          style={[styles.input, { borderColor: Colors[colorScheme].icon }]}
          placeholder="Email"
          placeholderTextColor={Colors[colorScheme].icon}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TouchableOpacity 
          style={[styles.button, { backgroundColor: Colors[colorScheme].tint }]} 
          onPress={handleResetPassword}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <ThemedText style={styles.buttonText}>Send Reset Link</ThemedText>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={navigateToLogin} style={styles.backToLogin}>
          <ThemedText style={styles.backToLoginText}>Back to Login</ThemedText>
        </TouchableOpacity>
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
    marginBottom: 20,
  },
  formContainer: {
    width: '100%',
  },
  instructions: {
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 24,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backToLogin: {
    alignItems: 'center',
  },
  backToLoginText: {
    color: '#2e7d32',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
*/