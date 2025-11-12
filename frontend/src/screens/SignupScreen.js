import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, ScrollView, StyleSheet } from 'react-native';
import api from '../api/client';

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobile, setMobile] = useState('');
  const [code, setCode] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [verified, setVerified] = useState(false);

  const requestCode = async () => {
    if (!mobile) {
      return Alert.alert('Error', 'Please enter a mobile number.');
    }
    try {
      const res = await api.post('/auth/request-phone-code/', { mobile_no: mobile });
      setSessionId(res.data.session_id);
      Alert.alert('Code Sent', 'A verification code was sent via SMS.');
    } catch (e) {
      Alert.alert('Error', 'Failed to request code. Please check the number format (+15551234567).');
    }
  };

  const verifyCode = async () => {
    if (!code) {
      return Alert.alert('Error', 'Please enter the verification code.');
    }
    try {
      await api.post('/auth/verify-phone-code/', { session_id: sessionId, code });
      setVerified(true);
      Alert.alert('Verified', 'Phone number verified successfully.');
    } catch (e) {
      Alert.alert('Error', 'Invalid or expired code.');
    }
  };

  const handleSignup = async () => {
    if (!verified) {
      return Alert.alert('Error', 'Please verify your phone number before signing up.');
    }
    if (!email || !password || !firstName || !lastName) {
      return Alert.alert('Error', 'Please fill in all user details.');
    }

    try {
      const payload = {
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        verification_session_id: sessionId,
        mobile_no: mobile,
      };
      await api.post('/auth/register/', payload);
      Alert.alert('Success', 'Registration successful! You can now log in.');
      navigation.navigate('Login');
    } catch (e) {
      const errorDetail = e.response?.data?.detail || 'An unknown error occurred.';
      Alert.alert('Registration Failed', errorDetail);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Create Account</Text>
      <TextInput value={firstName} onChangeText={setFirstName} placeholder="First Name" style={styles.input} />
      <TextInput value={lastName} onChangeText={setLastName} placeholder="Last Name" style={styles.input} />
      <TextInput value={email} onChangeText={setEmail} placeholder="Email" style={styles.input} keyboardType="email-address" autoCapitalize="none" />
      <TextInput value={password} onChangeText={setPassword} placeholder="Password" style={styles.input} secureTextEntry />

      <View style={styles.verificationSection}>
        <Text style={styles.subHeader}>Phone Verification</Text>
        <TextInput value={mobile} onChangeText={setMobile} placeholder="Mobile number e.g. +15551234567" style={styles.input} keyboardType="phone-pad" />
        <Button title="Request Code" onPress={requestCode} />
        <View style={{ height: 12 }} />
        <TextInput value={code} onChangeText={setCode} placeholder="Enter SMS code" style={styles.input} keyboardType="number-pad" />
        <Button title={verified ? '✓ Verified' : 'Verify Code'} onPress={verifyCode} disabled={verified || !sessionId || !code} />
      </View>

      <View style={{ marginTop: 24 }}>
        <Button title="Sign Up" onPress={handleSignup} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  subHeader: { fontSize: 18, fontWeight: '600', marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 6, marginBottom: 12, fontSize: 16 },
  verificationSection: { marginTop: 20, paddingTop: 20, borderTopWidth: 1, borderColor: '#eee' },
});
