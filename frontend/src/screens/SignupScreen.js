import React, { useState } from 'react'
import { View, Text, TextInput, Button, Alert } from 'react-native'
import api from '../api/client'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function SignupScreen({ navigation }) {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mobile, setMobile] = useState('')
  const [code, setCode] = useState('')
  const [sessionId, setSessionId] = useState('')
  const [verified, setVerified] = useState(false)

  const requestCode = async () => {
    try {
      const res = await api.post('/auth/request-phone-code/', { mobile_no: mobile })
      setSessionId(res.data.session_id)
      Alert.alert('Code Sent', 'A verification code was sent via SMS')
    } catch (e) {
      Alert.alert('Error', 'Failed to request code')
    }
  }

  const verifyCode = async () => {
    try {
      await api.post('/auth/verify-phone-code/', { session_id: sessionId, code })
      setVerified(true)
      Alert.alert('Verified', 'Phone number verified')
    } catch (e) {
      Alert.alert('Error', 'Invalid or expired code')
    }
  }

  const signup = async () => {
    try {
      if (!verified) return Alert.alert('Verify Phone', 'Verify phone before signup')
      const res = await api.post('/auth/register/', { username, email, password, mobile_no: mobile, verification_session_id: sessionId })
      await AsyncStorage.setItem('accessToken', res.data.access)
      await AsyncStorage.setItem('refreshToken', res.data.refresh)
      Alert.alert('Registered', 'Account created')
      navigation.navigate('Articles')
    } catch (e) {
      Alert.alert('Signup failed', 'Please check inputs')
    }
  }

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 16 }}>Signup</Text>
      <TextInput placeholder="Username" value={username} onChangeText={setUsername} style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 6, marginBottom: 10 }} />
      <TextInput placeholder="Email (optional)" value={email} onChangeText={setEmail} style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 6, marginBottom: 10 }} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 6, marginBottom: 10 }} />
      <TextInput placeholder="Mobile e.g. +15551234567" value={mobile} onChangeText={setMobile} style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 6, marginBottom: 10 }} />
      <Button title="Request Code" onPress={requestCode} />
      <View style={{ height: 12 }} />
      <TextInput placeholder="Enter code" value={code} onChangeText={setCode} style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 6, marginBottom: 10 }} />
      <Button title={verified ? 'Verified' : 'Verify Code'} onPress={verifyCode} disabled={verified || !sessionId || !code} />
      <View style={{ height: 12 }} />
      <Button title="Create Account" onPress={signup} />
    </View>
  )
}
