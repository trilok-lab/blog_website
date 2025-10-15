import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native'
import api from '../api/client'

export default function ArticlesListScreen({ navigation }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const res = await api.get('/api/articles/')
      setItems(res.data.results || res.data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} />

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => navigation.navigate('ArticleDetail', { slug: item.slug })} style={{ padding: 16, borderBottomWidth: 1, borderColor: '#eee' }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.title}</Text>
          {item.excerpt ? <Text style={{ color: '#666', marginTop: 6 }}>{item.excerpt}</Text> : null}
          <Text style={{ color: '#0a84ff', marginTop: 8 }}>Read more</Text>
        </TouchableOpacity>
      )}
    />
  )
}
