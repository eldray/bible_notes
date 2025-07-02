import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext'; // Revert to named import

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigation = useNavigation();

  // Debug: Confirm useAuth is available
  let auth;
  try {
    auth = useAuth();
    console.log('useAuth hook:', { type: typeof auth, login: typeof auth.login });
  } catch (error) {
    console.error('Failed to load useAuth:', error);
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Authentication context failed to load. Please restart the app.</Text>
      </View>
    );
  }

  const { login } = auth;

  const handleLogin = async () => {
    console.log('Login button clicked:', { email, loading, submitted });
    if (submitted || loading) {
      console.log('Login blocked: already submitted or loading');
      return;
    }

    if (!email || !password) {
      console.log('Validation failed: missing required fields', { email: !!email, password: !!password });
      Alert.alert('Error', 'Please enter both email and password.');
      setSubmitted(false);
      setLoading(false);
      console.log('State reset after validation failure:', { loading: false, submitted: false });
      return;
    }

    setSubmitted(true);
    setLoading(true);
    console.log('State updated:', { loading: true, submitted: true });

    try {
      console.log('Calling AuthContext login:', { email });
      await login(email, password);
      console.log('Navigating to Home');
      navigation.navigate('Home');
    } catch (error: any) {
      console.log('Login error:', { message: error.message });
      Alert.alert('Login Failed', error.message);
    } finally {
      setLoading(false);
      setSubmitted(false);
      console.log('State reset after login attempt:', { loading: false, submitted: false });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity
        style={[styles.button, (loading || submitted) && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={loading || submitted}
      >
        <Text style={styles.buttonText}>{loading ? 'Logging in...' : 'Login'}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.secondaryButton]}
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
  button: { backgroundColor: '#007AFF', padding: 10, borderRadius: 5, alignItems: 'center', marginBottom: 10 },
  buttonDisabled: { backgroundColor: '#A0A0A0' },
  secondaryButton: { backgroundColor: '#34C759' },
  buttonText: { color: '#fff', fontSize: 16 },
  errorText: { fontSize: 18, color: '#FF0000', textAlign: 'center' },
});

export default LoginScreen;
