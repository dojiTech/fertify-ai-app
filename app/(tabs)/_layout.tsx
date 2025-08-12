import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="calculator"
        options={{
          title: 'Fertify AI Calculator',
          tabBarIcon: ({ color }) => <IconSymbol size={40} name="function" color={color} />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Fertify AI Chat',
          tabBarIcon: ({ color }) => <IconSymbol size={40} name="bubble.left.and.bubble.right.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
