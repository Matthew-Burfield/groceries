import { Link, Stack, Tabs } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

function Settings() {
  return (
    <>
      <Stack.Screen options={{ title: 'Settings Stack' }} />
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Settings</Text>
        <Link href={{ pathname: '/(auth)/home' }}>Home</Link>
      </View>
    </>
  );
}

export default Settings;
