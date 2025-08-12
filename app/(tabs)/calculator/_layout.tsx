import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="input" />
      <Stack.Screen name="results" />
      <Stack.Screen name="history" />
      <Stack.Screen name="education" />
    </Stack>
  );
}