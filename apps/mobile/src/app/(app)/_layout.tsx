import { Link, Slot } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export const AppLayout = () => {
  return (
    <View style={styles.container}>
      <Text>Title</Text>
      <Slot />
      <Link href="/home">Home</Link>
      <Link href="/settings">settings</Link>
    </View>
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

export default AppLayout;
