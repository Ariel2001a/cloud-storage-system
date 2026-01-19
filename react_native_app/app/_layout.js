import { Stack } from "expo-router";
import { LanguageProvider } from '../context/LanguageContext'

export default function RootLayout() {
  return (
     <LanguageProvider>
    <Stack>
      <Stack.Screen name="register" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
</LanguageProvider>
  );
}

