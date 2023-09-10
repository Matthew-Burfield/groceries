import React from 'react';
import { Text, View } from 'react-native';

export const Home = () => {
  return (
    <View
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text>Welcome to Groceries!</Text>
    </View>
  );
};

export default Home;
