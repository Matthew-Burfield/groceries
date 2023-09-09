import { SignedIn } from '@clerk/clerk-expo';
import React from 'react';
import { Text } from 'react-native';

export const Home = () => {
  return (
    <SignedIn>
      <Text>Settings</Text>
    </SignedIn>
  );
};

export default Home;
