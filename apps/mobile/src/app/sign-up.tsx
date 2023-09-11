import { SignInWithGoogle } from '@groceries/auth';
import { Link } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

function SignUp() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Sign up</Text>
      <Link href={{ pathname: '/' }}>Home</Link>
      <Link href={{ pathname: '/login' }}>Login</Link>
      <SignInWithGoogle />
    </View>
  );
}

export default SignUp;
