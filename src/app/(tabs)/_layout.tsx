import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  AccountIcon,
  ExploreIcon,
  HomeIcon,
  TicketsIcon,
} from '@/components/ui/Icons';
import { useAppTheme } from '@/hooks/useAppTheme';

/**
 * Layout de pestañas inferiores (Bottom Tabs).
 *
 * Implementa la navegación nativa por pestañas (Tabs) de Expo Router.
 * Mantiene montadas las vistas para preservar el estado de navegación y scroll,
 * asegurando transiciones instantáneas sin parpadeos ni recargas.
 */
export default function TabLayout() {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.footerActive,
        tabBarInactiveTintColor: colors.footerInactive,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: colors.footerBg,
          borderTopColor: colors.footerBorder,
          borderTopWidth: 1,
          height: 56 + Math.max(insets.bottom, 8),
          paddingBottom: Math.max(insets.bottom, 8),
          paddingTop: 6,
          elevation: 12,
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.25,
          shadowRadius: 5,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          letterSpacing: 0.2,
        },
        tabBarItemStyle: {
          paddingVertical: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarLabel: 'Inicio',
          tabBarAccessibilityLabel: 'Pestaña Inicio',
          tabBarIcon: ({ color }) => <HomeIcon size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explorar',
          tabBarLabel: 'Explorar',
          tabBarAccessibilityLabel: 'Pestaña Explorar',
          tabBarIcon: ({ color }) => <ExploreIcon size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="tickets"
        options={{
          title: 'Tickets',
          tabBarLabel: 'Tickets',
          tabBarAccessibilityLabel: 'Pestaña Tickets',
          tabBarIcon: ({ color }) => <TicketsIcon size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Cuenta',
          tabBarLabel: 'Cuenta',
          tabBarAccessibilityLabel: 'Pestaña Cuenta',
          tabBarIcon: ({ color }) => <AccountIcon size={22} color={color} />,
        }}
      />
    </Tabs>
  );
}
