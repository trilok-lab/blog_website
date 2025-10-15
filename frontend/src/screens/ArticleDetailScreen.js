import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, ActivityIndicator } from 'react-native'
import api from '../api/client'

export default function ArticleDetailScreen({ route }) {
  const { slug } = route.params
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/api/articles/?search=${encodeURIComponent(slug)}`)
        const list = res.data.results || res.data
        const found = list.find((a) => a.slug === slug) || null
        setItem(found)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [slug])

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} />
  if (!item) return <Text style={{ margin: 16 }}>Article not found.</Text>

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{item.title}</Text>
      <Text style={{ marginTop: 12 }}>{item.body}</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 16 }}>
        {(item.categories || []).map((c) => (
          <Text key={c.id} style={{ marginRight: 8, color: '#666' }}>#{c.name}</Text>
        ))}
      </View>
    </ScrollView>
  )
}
