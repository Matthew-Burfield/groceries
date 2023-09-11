import { Link, Stack } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';
import { useAuth } from '@clerk/clerk-expo';

function Home() {
  const { userId, isSignedIn } = useAuth();
  return (
    <>
      <Stack.Screen options={{ title: 'Home Stack' }} />
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Portal</Text>
        <View
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 40,
            width: '100%',
          }}
        >
          <Link href={'/'}>Index</Link>
        </View>
        <View
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 40,
            width: '100%',
          }}
        >
          <Link href={'/portal/settings'}>Settings</Link>
        </View>
        <View
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 40,
            width: '100%',
          }}
        >
          <Text>{isSignedIn ? userId : 'Not logged in'}</Text>
        </View>
        <View
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 40,
            width: '100%',
          }}
        >
          <Link href={'/sign-up'}>Login</Link>
        </View>
      </View>
    </>
  );
}

export default Home;
