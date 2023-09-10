import { Link, Stack, Tabs } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

function Home() {
  return (
    <>
      <Stack.Screen options={{ title: 'Home Stack' }} />
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Portal</Text>
        <Link href={{ pathname: '/' }}>Home</Link>
        <Link href={{ pathname: '/(auth)/settings' }}>Settings</Link>
      </View>
    </>
  );
}

export default Home;
