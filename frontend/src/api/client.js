import axios from 'axios'
import Constants from 'expo-constants'
import AsyncStorage from '@react-native-async-storage/async-storage'

const manifest = Constants.expoConfig || {}
const extra = manifest.extra || {}
const BASE_URL = extra.API_BASE_URL || 'http://127.0.0.1:8000'

export const api = axios.create({
  baseURL: BASE_URL,
})

api.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem('accessToken')
    if (token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
    }
  } catch {}
  return config
})

export default api
