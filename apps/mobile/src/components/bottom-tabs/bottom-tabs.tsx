import { Link } from 'expo-router';
import React from 'react';

import { View, StyleSheet, TouchableOpacity } from 'react-native';

/* eslint-disable-next-line */
export interface BottomTabsProps {
  children: React.ReactNode;
}

export function BottomTabs(props: BottomTabsProps) {
  return <View style={styles.container}>{props.children}</View>;
}

type TabProps = {
  icon: React.ReactNode;
  label: React.ReactNode;
  link: string;
  isActive: boolean;
};

function Tab(props: TabProps) {
  const icon =
    props.isActive && React.isValidElement(props.icon)
      ? React.cloneElement<any>(props.icon, { color: 'blue' })
      : props.icon;
  return (
    <TouchableOpacity>
      <Link href={props.link}>
        <View style={styles.tab}>
          {icon}
          {props.label}
        </View>
      </Link>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    height: 80,
    width: '100%',
  },
  tab: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: {
    color: 'blue',
  },
});

BottomTabs.Tab = Tab;
export default BottomTabs;
