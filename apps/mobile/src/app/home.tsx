import { SignedIn } from '@clerk/clerk-expo';
import { SignOutButton } from '@groceries/auth';
import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Text } from 'react-native';

export const Home = () => {
  return (
    <SignedIn>
      <SafeAreaView style={styles.container}>
        <Text>Home</Text>
        <SignOutButton />
      </SafeAreaView>
    </SignedIn>
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

export default Home;
