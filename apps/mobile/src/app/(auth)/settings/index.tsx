import { Link, Stack, Tabs } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

export const Settings = () => {
  return (
    <>
      <Stack.Screen options={{ title: 'Settings' }} />
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Settings</Text>
        <Link href={{ pathname: '/portal/home' }}>Home</Link>
      </View>
    </>
  );
};

export default Settings;
