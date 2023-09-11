import { Tabs } from 'expo-router';
import React from 'react';

function PortalLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="home"
        options={{ tabBarLabel: 'Home', title: 'Home' }}
      />
      <Tabs.Screen
        name="settings"
        options={{ tabBarLabel: 'Settings', title: 'Settings' }}
      />
    </Tabs>
  );
}

export default PortalLayout;
