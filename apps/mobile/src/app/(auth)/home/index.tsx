import { Link, Stack, Tabs } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

export const Portal = () => {
  return (
    <>
      <Stack.Screen options={{ title: 'Home' }} />
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Portal</Text>
        <Link href={{ pathname: '/' }}>Home</Link>
        <Link href={{ pathname: '/portal/settings' }}>Settings</Link>
      </View>
    </>
  );
};

export default Portal;
