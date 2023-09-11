import { Link } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

function Index() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Index</Text>
      <Link href={{ pathname: '/portal/home' }}>Home</Link>
      <Link href={{ pathname: '/sign-up' }}>Sign Up</Link>
      <Link href={{ pathname: '/login' }}>Login</Link>
    </View>
  );
}

export default Index;
