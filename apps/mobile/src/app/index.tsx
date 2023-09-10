import { Link } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

export const Index = () => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Link href={{ pathname: 'settings', params: { name: 'Bacon' } }}>
        Go to Settings
      </Link>
    </View>
  );
};

export default Index;
