import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: '#2e7d32',
      tabBarInactiveTintColor: '#666',
      tabBarStyle: {
        backgroundColor: '#fff',
      },
    }}>
      <Tabs.Screen
        name="calculator"
        options={{
          title: 'Fertify AI Calculator',
          tabBarIcon: ({ color }) => (
            <Ionicons name="calculator" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Fertify AI Chat"
        options={{
          title: 'Fertify AI Chat',
          tabBarIcon: ({ color }) => (
            <Ionicons name="chatbubbles" size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}