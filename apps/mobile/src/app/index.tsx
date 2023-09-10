import { Link, Stack, Tabs } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

export const Index = () => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home page</Text>
      <Link href={{ pathname: '/login' }}>Login</Link>
      <Link href={{ pathname: '/sign-up' }}>Sign Up</Link>
      <Link href={{ pathname: '/(auth)/home' }}>Portal</Link>
    </View>
  );
};

export default Index;
