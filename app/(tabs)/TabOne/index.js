import { Text, View } from 'react-native';
import { Stack } from 'expo-router'

export default function Page() {
  return (
    <View>    
        <Stack.Screen options={{headerShown: true, title: "TabOne"}}/>
        <Text>Index page of TabOne</Text>
    </View>
);
}