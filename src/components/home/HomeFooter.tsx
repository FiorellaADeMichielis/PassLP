import { useRef } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePathname, useRouter } from 'expo-router';

import {
  AccountIcon,
  ExploreIcon,
  HomeIcon,
  TicketsIcon,
} from '@/components/ui/Icons';
import { useAppTheme } from '@/hooks/useAppTheme';

type TabKey = 'inicio' | 'explorar' | 'tickets' | 'cuenta';

interface HomeFooterProps {
  /** Callback opcional al presionar Inicio (por ej. scrollear al tope). */
  onPressHome?: () => void;
  /** Pestaña activa forzada si se desea omitir la detección automática por ruta. */
  currentTab?: TabKey;
}

/**
 * Barra de navegación inferior fija (Sticky Bottom Navigation Bar).
 *
 * Siempre presente en la parte inferior de la pantalla. Contiene accesos directos
 * a Inicio, Explorar, Tickets y Cuenta con iconos SVG nativos adaptados
 * al tema claro y oscuro con alto contraste (WCAG AA/AAA).
 */
export function HomeFooter({ onPressHome, currentTab }: HomeFooterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const isNavigatingRef = useRef(false);

  // Se deriva la pestaña activa dinámicamente de la ruta para que al volver
  // atrás con gestos o botón nativo de Android, se resincronice inmediatamente.
  const isAccountRoute = pathname.includes('/account') || pathname === '/account';
  const activeTab: TabKey = currentTab ?? (isAccountRoute ? 'cuenta' : 'inicio');

  function handleTabPress(tab: TabKey) {
    if (tab === 'inicio') {
      if (activeTab === 'inicio') {
        if (onPressHome) onPressHome();
      } else {
        if (isNavigatingRef.current) return;
        isNavigatingRef.current = true;
        setTimeout(() => {
          isNavigatingRef.current = false;
        }, 500);

        if (router.canGoBack()) {
          router.back();
        } else {
          router.replace('/');
        }
      }
    } else if (tab === 'explorar') {
      Alert.alert('Explorar', 'La sección de exploración estará disponible próximamente.');
    } else if (tab === 'tickets') {
      Alert.alert('Mis Tickets', 'La visualización de tickets estará disponible próximamente.');
    } else if (tab === 'cuenta') {
      if (activeTab !== 'cuenta') {
        if (isNavigatingRef.current) return;
        isNavigatingRef.current = true;
        setTimeout(() => {
          isNavigatingRef.current = false;
        }, 500);

        router.push('/account');
      }
    }
  }

  const activeColor = colors.footerActive;
  const inactiveColor = colors.footerInactive;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.footerBg,
          borderTopColor: colors.footerBorder,
          paddingBottom: Math.max(insets.bottom, 8),
        },
      ]}
    >
      {/* Botón 1: Inicio */}
      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => handleTabPress('inicio')}
        activeOpacity={0.7}
        accessibilityRole="tab"
        accessibilityState={{ selected: activeTab === 'inicio' }}
        accessibilityLabel="Pestaña Inicio"
      >
        <HomeIcon
          size={22}
          color={activeTab === 'inicio' ? activeColor : inactiveColor}
          style={styles.icon}
        />
        <Text
          style={[
            styles.label,
            { color: activeTab === 'inicio' ? activeColor : inactiveColor },
            activeTab === 'inicio' && styles.labelActive,
          ]}
        >
          Inicio
        </Text>
      </TouchableOpacity>

      {/* Botón 2: Explorar */}
      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => handleTabPress('explorar')}
        activeOpacity={0.7}
        accessibilityRole="tab"
        accessibilityState={{ selected: activeTab === 'explorar' }}
        accessibilityLabel="Pestaña Explorar"
      >
        <ExploreIcon
          size={22}
          color={activeTab === 'explorar' ? activeColor : inactiveColor}
          style={styles.icon}
        />
        <Text
          style={[
            styles.label,
            { color: activeTab === 'explorar' ? activeColor : inactiveColor },
            activeTab === 'explorar' && styles.labelActive,
          ]}
        >
          Explorar
        </Text>
      </TouchableOpacity>

      {/* Botón 3: Tickets */}
      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => handleTabPress('tickets')}
        activeOpacity={0.7}
        accessibilityRole="tab"
        accessibilityState={{ selected: activeTab === 'tickets' }}
        accessibilityLabel="Pestaña Tickets"
      >
        <TicketsIcon
          size={22}
          color={activeTab === 'tickets' ? activeColor : inactiveColor}
          style={styles.icon}
        />
        <Text
          style={[
            styles.label,
            { color: activeTab === 'tickets' ? activeColor : inactiveColor },
            activeTab === 'tickets' && styles.labelActive,
          ]}
        >
          Tickets
        </Text>
      </TouchableOpacity>

      {/* Botón 4: Cuenta */}
      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => handleTabPress('cuenta')}
        activeOpacity={0.7}
        accessibilityRole="tab"
        accessibilityState={{ selected: activeTab === 'cuenta' }}
        accessibilityLabel="Pestaña Cuenta"
      >
        <AccountIcon
          size={22}
          color={activeTab === 'cuenta' ? activeColor : inactiveColor}
          style={styles.icon}
        />
        <Text
          style={[
            styles.label,
            { color: activeTab === 'cuenta' ? activeColor : inactiveColor },
            activeTab === 'cuenta' && styles.labelActive,
          ]}
        >
          Cuenta
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
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
