import { Tabs } from 'expo-router';

function AuthLayout() {
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

export default AuthLayout;
