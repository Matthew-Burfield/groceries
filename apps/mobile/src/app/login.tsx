import { Link } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

function Login() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Login</Text>
      <Link href={{ pathname: '/' }}>Home</Link>
      <Link href={{ pathname: '/sign-up' }}>Sign Up</Link>
    </View>
  );
}

export default Login;
