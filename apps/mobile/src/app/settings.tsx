import { View, Text } from 'react-native';
import { Link } from 'expo-router';

export default function Details() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Settings</Text>
      <Link href={{ pathname: '/' }}>Go to Home</Link>
    </View>
  );
}
