import { Stack } from 'expo-router';

export default function AdminLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="create-enigme" />
      <Stack.Screen name="gestion-users" />
      <Stack.Screen name="liste-enigmes" />
    </Stack>
  );
}
