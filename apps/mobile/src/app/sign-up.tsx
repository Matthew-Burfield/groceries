import { Link } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

export const SignUp = () => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Sign up</Text>
      <Link href={{ pathname: '/' }}>Home</Link>
      <Link href={{ pathname: '/login' }}>Login</Link>
      <Link href={{ pathname: '/sign-up' }}>Sign Up</Link>
    </View>
  );
};

export default SignUp;
