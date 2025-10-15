import React, { useState } from 'react'
import { View, Text, TextInput, Button, Alert } from 'react-native'
import api from '../api/client'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const login = async () => {
    try {
      const res = await api.post('/auth/jwt/create/', { username, password })
      await AsyncStorage.setItem('accessToken', res.data.access)
      await AsyncStorage.setItem('refreshToken', res.data.refresh)
      Alert.alert('Logged in', 'You are now logged in')
      navigation.navigate('Articles')
    } catch (e) {
      Alert.alert('Login failed', 'Invalid credentials')
    }
  }

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 16 }}>Login</Text>
      <TextInput placeholder="Username" value={username} onChangeText={setUsername} style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 6, marginBottom: 10 }} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 6, marginBottom: 10 }} />
      <Button title="Login" onPress={login} />
      <View style={{ height: 12 }} />
      <Button title="Go to Signup" onPress={() => navigation.navigate('Signup')} />
    </View>
  )
}
