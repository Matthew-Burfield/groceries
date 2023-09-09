import { SignedIn } from '@clerk/clerk-expo';
import React from 'react';
import { Text } from 'react-native';

export const Home = () => {
  return (
    <SignedIn>
      <Text>Welcome to Groceries!</Text>
    </SignedIn>
  );
};

export default Home;
