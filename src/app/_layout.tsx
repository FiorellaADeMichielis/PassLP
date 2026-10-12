import { useEffect } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';

import { useAppTheme } from '@/hooks/useAppTheme';

SplashScreen.preventAutoHideAsync();

/**
 * Root Layout de la aplicación.
 *
 * Sincroniza la barra de estado (StatusBar) y el tema del sistema
 * para asegurar máxima visibilidad de la hora, batería, wifi y señal.
 */
export default function RootLayout() {
  const { isDark, colors } = useAppTheme();

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <StatusBar style={colors.statusBarStyle} />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: {
            backgroundColor: colors.screenBg,
          },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="event/[id]" />
        <Stack.Screen name="checkout/[id]" />
      </Stack>
    </ThemeProvider>
  );
}
