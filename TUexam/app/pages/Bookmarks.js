import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { firebaseauth }from '../config/firebase';

export default function Bookmarks() {
  const user = firebaseauth.currentUser;
  return (
    <View style={styles.container}>
      <Text>Bookmarks</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});