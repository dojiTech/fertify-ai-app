import { Redirect } from 'expo-router';

export default function TabIndex() {
  // Redirect to the input screen by default
  return <Redirect href="/(tabs)/calculator/input" />;
}