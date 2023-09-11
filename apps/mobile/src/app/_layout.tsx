import { Stack } from 'expo-router';
import { ClerkProvider } from '@clerk/clerk-expo';
import React from 'react';
import Constants from 'expo-constants';
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

function RootLayout() {
  return (
    <ClerkProvider
      tokenCache={tokenCache}
      publishableKey={Constants.expoConfig?.extra?.clerkPublishableKey}
    >
      <Stack screenOptions={{ headerShown: false }} />
    </ClerkProvider>
  );
}

export default RootLayout;
