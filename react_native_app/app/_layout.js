import { Stack } from "expo-router";
import { LanguageProvider } from '../context/LanguageContext'
import { ThemeProvider } from '../context/ThemeContext'

export default function RootLayout() {
  return (
            <LanguageProvider>
              <ThemeProvider>
                <Stack>
                    
                  <Stack.Screen name="register" options={{ headerShown: false }} />
                  <Stack.Screen name="login" options={{ headerShown: false }} />
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                
                </Stack>
              </ThemeProvider>
          </LanguageProvider>
  );
}

