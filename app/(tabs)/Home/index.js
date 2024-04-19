import { Text, View } from 'react-native';
import { Stack } from "expo-router";

export default function Page() {
  return (
    <View>
      <Stack.Screen options={{headerShown: true, title: "Home"}}/>
      <Text>Index page of Home Tab</Text>
    </View>
  
);
}