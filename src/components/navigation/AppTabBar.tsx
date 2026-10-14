import { type ComponentProps, useEffect, useState } from 'react';
import {
  Alert,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  AccountIcon,
  ExploreIcon,
  HomeIcon,
  TicketsIcon,
} from '@/components/ui/Icons';
import { useAppTheme } from '@/hooks/useAppTheme';

export type AppTabBarProps = Parameters<NonNullable<ComponentProps<typeof Tabs>['tabBar']>>[0];

/**
 * Barra de pestañas inferior (Bottom Tab Bar) institucional.
 *
 * Muestra los 4 accesos directos institucionales:
 * - Inicio: pantalla principal del catálogo (ruta 'index').
 * - Explorar: funcionalidad informada como próximamente mediante alerta nativa.
 * - Tickets: funcionalidad informada como próximamente mediante alerta nativa.
 * - Cuenta: pantalla de autenticación y perfil (ruta 'account').
 *
 * Se oculta automáticamente cuando el teclado virtual está desplegado.
 */
export function AppTabBar({ state, navigation }: AppTabBarProps) {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () =>
      setIsKeyboardVisible(true)
    );
    const hideSub = Keyboard.addListener('keyboardDidHide', () =>
      setIsKeyboardVisible(false)
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  if (isKeyboardVisible) {
    return null;
  }

  const currentRouteName = state.routes[state.index]?.name;
  const isInicioActive = currentRouteName === 'index';
  const isCuentaActive = currentRouteName === 'account';

  const activeColor = colors.footerActive;
  const inactiveColor = colors.footerInactive;

  function handleTabPress(tabKey: 'inicio' | 'explorar' | 'tickets' | 'cuenta') {
    if (tabKey === 'inicio') {
      if (!isInicioActive) {
        navigation.navigate('index');
      }
    } else if (tabKey === 'explorar') {
      Alert.alert(
        'Explorar',
        'La sección de exploración estará disponible próximamente.'
      );
    } else if (tabKey === 'tickets') {
      Alert.alert(
        'Mis Tickets',
        'La visualización de tickets estará disponible próximamente.'
      );
    } else if (tabKey === 'cuenta') {
      if (!isCuentaActive) {
        navigation.navigate('account');
      }
    }
  }

  return (
    <View
      style={[
        styles.tabBarContainer,
        {
          backgroundColor: colors.footerBg,
          borderTopColor: colors.footerBorder,
          paddingBottom: Math.max(insets.bottom, 8),
        },
      ]}
      accessibilityRole="tablist"
    >
      {/* Pestaña 1: Inicio */}
      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => handleTabPress('inicio')}
        activeOpacity={0.7}
        accessibilityRole="tab"
        accessibilityState={{ selected: isInicioActive }}
        accessibilityLabel="Pestaña Inicio"
      >
        <HomeIcon
          size={22}
          color={isInicioActive ? activeColor : inactiveColor}
          style={styles.icon}
        />
        <Text
          style={[
            styles.label,
            { color: isInicioActive ? activeColor : inactiveColor },
            isInicioActive && styles.labelActive,
          ]}
        >
          Inicio
        </Text>
      </TouchableOpacity>

      {/* Pestaña 2: Explorar */}
      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => handleTabPress('explorar')}
        activeOpacity={0.7}
        accessibilityRole="tab"
        accessibilityState={{ selected: false }}
        accessibilityLabel="Pestaña Explorar"
      >
        <ExploreIcon size={22} color={inactiveColor} style={styles.icon} />
        <Text style={[styles.label, { color: inactiveColor }]}>Explorar</Text>
      </TouchableOpacity>

      {/* Pestaña 3: Tickets */}
      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => handleTabPress('tickets')}
        activeOpacity={0.7}
        accessibilityRole="tab"
        accessibilityState={{ selected: false }}
        accessibilityLabel="Pestaña Tickets"
      >
        <TicketsIcon size={22} color={inactiveColor} style={styles.icon} />
        <Text style={[styles.label, { color: inactiveColor }]}>Tickets</Text>
      </TouchableOpacity>

      {/* Pestaña 4: Cuenta */}
      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => handleTabPress('cuenta')}
        activeOpacity={0.7}
        accessibilityRole="tab"
        accessibilityState={{ selected: isCuentaActive }}
        accessibilityLabel="Pestaña Cuenta"
      >
        <AccountIcon
          size={22}
          color={isCuentaActive ? activeColor : inactiveColor}
          style={styles.icon}
        />
        <Text
          style={[
            styles.label,
            { color: isCuentaActive ? activeColor : inactiveColor },
            isCuentaActive && styles.labelActive,
          ]}
        >
          Cuenta
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    borderTopWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 8,
    elevation: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    gap: 3,
  },
  icon: {
    marginBottom: 1,
  },
  label: {
    fontSize: 11,
    letterSpacing: 0.2,
    fontWeight: '500',
  },
  labelActive: {
    fontWeight: '700',
  },
});
