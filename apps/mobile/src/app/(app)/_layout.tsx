import * as React from 'react';
import { Slot, usePathname } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import BottomTabs from '../../components/bottom-tabs/bottom-tabs';
import {
  ClipboardList as ListIcon,
  Settings as SettingsIcon,
} from 'lucide-react-native';

const tabs = [
  {
    icon: <ListIcon color={'black'} size={48} />,
    label: <Text>Home</Text>,
    link: '/home',
  },
  {
    icon: <SettingsIcon color={'black'} size={48} />,
    label: <Text style={{ color: 'blue' }}>Settings</Text>,
    link: '/settings',
  },
];

export const AppLayout = () => {
  const pathname = usePathname();

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <Slot />
      </View>
      <BottomTabs>
        {tabs.map((tab) => (
          <BottomTabs.Tab
            key={tab.link}
            isActive={tab.link === pathname}
            {...tab}
          />
        ))}
      </BottomTabs>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: '#fff',
  },
});

export default AppLayout;
