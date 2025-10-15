import React, { useState } from 'react'
import { View, Text, TextInput, Button, Alert, ScrollView, Linking } from 'react-native'
import api from '../api/client'

export default function SubmitArticleScreen() {
  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [body, setBody] = useState('')
  const [mobile, setMobile] = useState('')
  const [code, setCode] = useState('')
  const [sessionId, setSessionId] = useState('')
  const [verified, setVerified] = useState(false)
  const [stripeSessionId, setStripeSessionId] = useState('')
  const [stripePaid, setStripePaid] = useState(false)

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

  const createCheckout = async () => {
    try {
      const res = await api.post('/api/payments/checkout-session/', {})
      const { id, url } = res.data || {}
      if (id && url) {
        setStripeSessionId(id)
        Linking.openURL(url)
      } else {
        Alert.alert('Error', 'Failed to create checkout session')
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to create checkout session')
    }
  }

  const verifyPayment = async () => {
    try {
      if (!stripeSessionId) return Alert.alert('Payment', 'No checkout session created yet')
      const res = await api.post('/api/payments/verify-session/', { session_id: stripeSessionId })
      if (res.data && res.data.paid) {
        setStripePaid(true)
        Alert.alert('Payment', 'Payment verified')
      } else {
        Alert.alert('Payment', 'Payment not completed yet')
      }
    } catch (e) {
      Alert.alert('Error', 'Could not verify payment')
    }
  }

  const submit = async () => {
    try {
      if (!verified) {
        return Alert.alert('Verify Phone', 'Please verify your phone before submitting')
      }
      if (!stripePaid) {
        return Alert.alert('Complete Payment', 'Please complete and verify payment before submitting')
      }
      const payload = { title, excerpt, body, category_ids: [], verification_session_id: sessionId, stripe_session_id: stripeSessionId }
      await api.post('/api/articles/', payload)
      Alert.alert('Submitted', 'Article submitted. Awaiting approval if guest.')
      setTitle(''); setExcerpt(''); setBody('')
    } catch (e) {
      Alert.alert('Error', 'Failed to submit article')
    }
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 18, marginBottom: 8 }}>Title</Text>
      <TextInput value={title} onChangeText={setTitle} placeholder="Title" style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 6 }} />
      <Text style={{ fontSize: 18, marginVertical: 8 }}>Excerpt</Text>
      <TextInput value={excerpt} onChangeText={setExcerpt} placeholder="Excerpt" style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 6 }} />
      <Text style={{ fontSize: 18, marginVertical: 8 }}>Body</Text>
      <TextInput value={body} onChangeText={setBody} placeholder="Body" multiline numberOfLines={6} style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 6, minHeight: 120 }} />

      <View style={{ marginTop: 24, paddingTop: 12, borderTopWidth: 1, borderColor: '#eee' }}>
        <Text style={{ fontSize: 18, marginBottom: 8 }}>Phone Verification (for guests)</Text>
        <TextInput value={mobile} onChangeText={setMobile} placeholder="Mobile number e.g. +15551234567" style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 6, marginBottom: 8 }} />
        <Button title="Request Code" onPress={requestCode} />
        <View style={{ height: 12 }} />
        <TextInput value={code} onChangeText={setCode} placeholder="Enter code" style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 6, marginBottom: 8 }} />
        <Button title={verified ? 'Verified' : 'Verify Code'} onPress={verifyCode} disabled={verified || !sessionId || !code} />
      </View>

      <View style={{ marginTop: 24, paddingTop: 12, borderTopWidth: 1, borderColor: '#eee' }}>
        <Text style={{ fontSize: 18, marginBottom: 8 }}>Payment (Stripe)</Text>
        <Button title={stripeSessionId ? 'Open Checkout Again' : 'Pay $1.99'} onPress={createCheckout} />
        <View style={{ height: 12 }} />
        <Button title={stripePaid ? 'Payment Verified' : 'Verify Payment'} onPress={verifyPayment} disabled={!stripeSessionId || stripePaid} />
      </View>

      <View style={{ marginTop: 24 }}>
        <Button title="Submit" onPress={submit} />
      </View>
    </ScrollView>
  )
}
