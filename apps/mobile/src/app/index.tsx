import { SignedIn, SignedOut } from '@clerk/clerk-expo';
import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { SignOutButton, SignUpScreen } from '@groceries/auth';
import { Text } from 'react-native';

export const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <SignedIn>
        <Text>Hello World</Text>
        <SignOutButton />
      </SignedIn>
      <SignedOut>
        <SignUpScreen />
      </SignedOut>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flaik: 1,
    height: '100%',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
