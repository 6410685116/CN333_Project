import { View, Text } from 'react-native'
import React from 'react'

export default function Report({ route }) {
  const { user } = route.params || {};
  return (
    <View>
      <Text>Report</Text>
    </View>
  )
}