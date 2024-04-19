import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

// const ExpoSecureStoreAdapter = {
//   getItem: (key) => {
//     return SecureStore.getItemAsync(key)
//   },
//   setItem: (key, value) => {
//     SecureStore.setItemAsync(key, value)
//   },
//   removeItem: (key) => {
//     SecureStore.deleteItemAsync(key)
//   },
// }

const supabaseUrl = "https://kvquyjleskbnbpmkrsko.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2cXV5amxlc2tibmJwbWtyc2tvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI5Mjg4NTQsImV4cCI6MjAyODUwNDg1NH0.sxjrv0lHqkkVSdap37yiQ69Bvs8MAJaZxssAKBgSiVA"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
})