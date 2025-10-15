import React, { useEffect, useState } from 'react'
import { View, Text, TextInput, Button, FlatList, Alert } from 'react-native'
import api from '../api/client'

export default function CommentsScreen({ route }) {
  const { articleId } = route.params || {}
  const [comments, setComments] = useState([])
  const [authorName, setAuthorName] = useState('')
  const [authorMobile, setAuthorMobile] = useState('')
  const [body, setBody] = useState('')
  const [sessionId, setSessionId] = useState('')
  const [code, setCode] = useState('')
  const [verified, setVerified] = useState(false)

  const load = async () => {
    try {
      const res = await api.get('/api/comments/')
      setComments(res.data.results || res.data)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => { load() }, [])

  const requestCode = async () => {
    try {
      const res = await api.post('/auth/request-phone-code/', { mobile_no: authorMobile })
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

  const submit = async () => {
    try {
      const payload = { article: articleId, author_name: authorName, author_mobile: authorMobile, body }
      if (!verified) payload.verification_session_id = sessionId
      await api.post('/api/comments/', payload)
      Alert.alert('Submitted', 'Comment submitted. Guests require approval.')
      setAuthorName(''); setAuthorMobile(''); setBody(''); setCode(''); setVerified(false); setSessionId('');
      load()
    } catch (e) {
      Alert.alert('Error', 'Failed to submit comment')
    }
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={comments}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={{ paddingVertical: 8, borderBottomWidth: 1, borderColor: '#eee' }}>
            <Text style={{ fontWeight: 'bold' }}>{item.user ? 'User' : (item.author_name || 'Guest')}</Text>
            <Text>{item.body}</Text>
          </View>
        )}
      />
      <View style={{ marginTop: 16 }}>
        <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Add Comment</Text>
        <TextInput value={authorName} onChangeText={setAuthorName} placeholder="Your name" style={{ borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 6, marginBottom: 8 }} />
        <TextInput value={authorMobile} onChangeText={setAuthorMobile} placeholder="Mobile number" style={{ borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 6, marginBottom: 8 }} />
        <Button title="Request Code" onPress={requestCode} />
        <View style={{ height: 8 }} />
        <TextInput value={code} onChangeText={setCode} placeholder="Enter code" style={{ borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 6, marginBottom: 8 }} />
        <Button title={verified ? 'Verified' : 'Verify Code'} onPress={verifyCode} disabled={verified || !sessionId || !code} />
        <View style={{ height: 12 }} />
        <TextInput value={body} onChangeText={setBody} placeholder="Comment" multiline style={{ borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 6, minHeight: 80 }} />
        <Button title="Submit" onPress={submit} />
      </View>
    </View>
  )
}
