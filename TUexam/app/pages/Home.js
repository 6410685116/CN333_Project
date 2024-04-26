import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { firebasestorage, firebasedb } from '../config/firebase';

export default function Home({ route }) {
  const { user } = route.params || {};

  // useEffect(() => {
    

  // }, []);


  return (
    <View style={styles.container}>
      <Text>Welcome to the Home Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});