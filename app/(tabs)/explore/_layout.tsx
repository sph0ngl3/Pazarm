import { Stack } from 'expo-router';

export default function ExploreLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="location/[id]" options={{ presentation: 'card' }} />
      <Stack.Screen name="tracking" options={{ presentation: 'modal' }} />
    </Stack>
  );
}
