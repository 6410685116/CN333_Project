import { View, Text } from 'react-native'
import React from 'react'

export default function Showfile({ route }) {
  const { file } = route.params;

  return (
    <View style={styles.showFileContainer}>
      <Text style={styles.fileName}>{file.fileName}</Text>
      <Text style={styles.fileUrl}>{file.url}</Text>
      {/* Add additional components to display file details */}
    </View>
  );
}