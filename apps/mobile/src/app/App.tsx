import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-expo';
import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import { SignOutButton, SignUpScreen } from '@groceries/auth';
import * as SecureStore from 'expo-secure-store';

const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

export const App = () => {
  return (
    <ClerkProvider
      tokenCache={tokenCache}
      publishableKey={Constants.expoConfig?.extra?.clerkPublishableKey}
    >
      <SafeAreaView style={styles.container}>
        <SignedIn>
          <SignOutButton />
        </SignedIn>
        <SignedOut>
          <SignUpScreen />
        </SignedOut>
      </SafeAreaView>
    </ClerkProvider>
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
