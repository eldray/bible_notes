import React, { useState } from 'react';
import { View, Text, TextInput, Picker, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

const RegisterScreen = () => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    churchName: '',
    churchBranch: '',
    denomination: 'Baptist',
    role: 'Member',
    bio: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigation = useNavigation();

  // Debug: Confirm useAuth is available
  let auth;
  try {
    auth = useAuth();
    console.log('useAuth hook:', { type: typeof auth, register: typeof auth.register });
  } catch (error) {
    console.error('Failed to load useAuth:', error);
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Authentication context failed to load. Please restart the app.</Text>
      </View>
    );
  }

  const { register } = auth;

  const denominations = ['Baptist', 'Catholic', 'Pentecostal', 'Methodist', 'Presbyterian', 'Lutheran', 'Anglican', 'Non-Denominational', 'Other'];
  const roles = ['Pastor', 'Elder', 'Deacon', 'Member', 'Youth Leader', 'Worship Leader', 'Teacher', 'Other'];

  const handleRegister = async () => {
    console.log('Register button clicked:', { form, loading, submitted });
    if (submitted || loading) {
      console.log('Registration blocked: already submitted or loading');
      return;
    }

    if (!form.firstName || !form.lastName || !form.email || !form.password || !form.churchName) {
      console.log('Validation failed: missing required fields', {
        firstName: !!form.firstName,
        lastName: !!form.lastName,
        email: !!form.email,
        password: !!form.password,
        churchName: !!form.churchName,
      });
      Alert.alert('Error', 'Please fill in all required fields: First Name, Last Name, Email, Password, Church Name.');
      setSubmitted(false);
      setLoading(false);
      console.log('State reset after validation failure:', { loading: false, submitted: false });
      return;
    }

    // Mock signup for testing
    if (__DEV__) {
      console.log('Mock signup:', form);
      navigation.navigate('Home');
      return;
    }

    setSubmitted(true);
    setLoading(true);
    console.log('State updated:', { loading: true, submitted: true });

    try {
      console.log('Calling AuthContext register:', { email: form.email });
      await register({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phoneNumber: form.phoneNumber,
        password: form.password,
        churchName: form.churchName,
        churchBranch: form.churchBranch,
        denomination: form.denomination,
        role: form.role,
        bio: form.bio,
      });
      console.log('Navigating to Home');
      Alert.alert('Success', 'Registration successful!');
      navigation.navigate('Home');
    } catch (error: any) {
      console.log('Registration error:', { error: error.message });
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
      setSubmitted(false);
      console.log('State reset after registration attempt:', { loading: false, submitted: false });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput
        style={styles.input}
        placeholder="First Name *"
        value={form.firstName}
        onChangeText={(value) => setForm({ ...form, firstName: value })}
        autoCapitalize="words"
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name *"
        value={form.lastName}
        onChangeText={(value) => setForm({ ...form, lastName: value })}
        autoCapitalize="words"
      />
      <TextInput
        style={styles.input}
        placeholder="Email *"
        value={form.email}
        onChangeText={(value) => setForm({ ...form, email: value })}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={form.phoneNumber}
        onChangeText={(value) => setForm({ ...form, phoneNumber: value })}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Password *"
        value={form.password}
        onChangeText={(value) => setForm({ ...form, password: value })}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Church Name *"
        value={form.churchName}
        onChangeText={(value) => setForm({ ...form, churchName: value })}
        autoCapitalize="words"
      />
      <TextInput
        style={styles.input}
        placeholder="Church Branch"
        value={form.churchBranch}
        onChangeText={(value) => setForm({ ...form, churchBranch: value })}
        autoCapitalize="words"
      />
      <Picker
        selectedValue={form.denomination}
        onValueChange={(value) => setForm({ ...form, denomination: value })}
        style={styles.picker}
      >
        {denominations.map((denom) => (
          <Picker.Item key={denom} label={denom} value={denom} />
        ))}
      </Picker>
      <Picker
        selectedValue={form.role}
        onValueChange={(value) => setForm({ ...form, role: value })}
        style={styles.picker}
      >
        {roles.map((role) => (
          <Picker.Item key={role} label={role} value={role} />
        ))}
      </Picker>
      <TextInput
        style={styles.input}
        placeholder="Bio"
        value={form.bio}
        onChangeText={(value) => setForm({ ...form, bio: value })}
        multiline
      />
      <TouchableOpacity
        style={[styles.button, (loading || submitted) && styles.buttonDisabled]}
        onPress={handleRegister}
        disabled={loading || submitted}
      >
        <Text style={styles.buttonText}>{loading ? 'Registering...' : 'Register'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
  picker: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
  button: { backgroundColor: '#007AFF', padding: 10, borderRadius: 5, alignItems: 'center' },
  buttonDisabled: { backgroundColor: '#A0A0A0' },
  buttonText: { color: '#fff', fontSize: 16 },
  errorText: { fontSize: 18, color: '#FF0000', textAlign: 'center' },
});

export default RegisterScreen;
