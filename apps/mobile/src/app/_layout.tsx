import { Slot } from 'expo-router';
import { ClerkProvider } from '@clerk/clerk-expo';
import React from 'react';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';
import { SafeAreaView } from 'react-native';

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

export const RootLayout = () => {
  return (
    <ClerkProvider
      tokenCache={tokenCache}
      publishableKey={Constants.expoConfig?.extra?.clerkPublishableKey}
    >
      <SafeAreaView>
        <Slot />
      </SafeAreaView>
    </ClerkProvider>
  );
};

export default RootLayout;
