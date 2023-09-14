import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo';
import { SignOutButton } from '@groceries/auth';
import { Link, Stack } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

function Settings() {
  const { user } = useUser();
  return (
    <>
      <Stack.Screen options={{ title: 'Settings Stack' }} />
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <SignedIn>
          <Text>Hello, {user?.firstName}</Text>
          <SignOutButton />
        </SignedIn>
        <SignedOut>
          <Link href="/login">Login</Link>
          <Link href="/sign-up">Create an account</Link>
        </SignedOut>
        <SignOutButton />
      </View>
    </>
  );
}

export default Settings;
