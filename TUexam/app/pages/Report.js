import { View, Text } from 'react-native'
import React from 'react'

export default function Report() {
  const user = firebaseauth.currentUser;
  return (
    <View>
      <Text>Report</Text>
    </View>
  )
}