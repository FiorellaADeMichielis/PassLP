import { useState } from 'react';
import { Href, useRouter } from 'expo-router';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  AccountIcon,
  ExploreIcon,
  HomeIcon,
  TicketsIcon,
} from '@/components/ui/Icons';

// ─── Colores con alto contraste (WCAG AA/AAA sobre fondo #332F2B) ─────────────
const BAR_BG = '#332F2B';
const BORDER_TOP = '#47423D';
const ACTIVE_COLOR = '#F77F00'; // Naranja oficial (contraste 5.05:1)
const INACTIVE_COLOR = '#D0CBC5'; // Gris claro visible (contraste 9.8:1)

type TabKey = 'inicio' | 'explorar' | 'tickets' | 'cuenta';

interface HomeFooterProps {
  /** Callback opcional al presionar Inicio (por ej. scrollear al tope). */
  onPressHome?: () => void;
}

/**
 * Barra de navegación inferior fija (Sticky Bottom Navigation Bar).
 *
 * Siempre presente en la parte inferior de la pantalla. Contiene accesos directos
 * a Inicio, Explorar, Tickets y Cuenta con iconos SVG nativos (react-native-svg)
 * de alto contraste sobre fondo institucional `#332F2B`.
 */
export function HomeFooter({ onPressHome }: HomeFooterProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<TabKey>('inicio');

  function handleTabPress(tab: TabKey) {
    if (tab === 'inicio') {
      setActiveTab('inicio');
      if (onPressHome) onPressHome();
    } else if (tab === 'explorar') {
      setActiveTab('inicio');
      Alert.alert('Explorar', 'La sección de exploración estará disponible próximamente.');
    } else if (tab === 'tickets') {
      setActiveTab('inicio');
      Alert.alert('Mis Tickets', 'La visualización de tickets estará disponible próximamente.');
    } else if (tab === 'cuenta') {
      router.push('/login' as unknown as Href);
    }
  }

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 8) }]}>
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
          color={activeTab === 'inicio' ? ACTIVE_COLOR : INACTIVE_COLOR}
          style={styles.icon}
        />
        <Text
          style={[
            styles.label,
            activeTab === 'inicio' ? styles.labelActive : styles.labelInactive,
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
          color={activeTab === 'explorar' ? ACTIVE_COLOR : INACTIVE_COLOR}
          style={styles.icon}
        />
        <Text
          style={[
            styles.label,
            activeTab === 'explorar' ? styles.labelActive : styles.labelInactive,
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
          color={activeTab === 'tickets' ? ACTIVE_COLOR : INACTIVE_COLOR}
          style={styles.icon}
        />
        <Text
          style={[
            styles.label,
            activeTab === 'tickets' ? styles.labelActive : styles.labelInactive,
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
          color={activeTab === 'cuenta' ? ACTIVE_COLOR : INACTIVE_COLOR}
          style={styles.icon}
        />
        <Text
          style={[
            styles.label,
            activeTab === 'cuenta' ? styles.labelActive : styles.labelInactive,
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
    backgroundColor: BAR_BG,
    borderTopWidth: 1,
    borderTopColor: BORDER_TOP,
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
  },
  labelActive: {
    color: ACTIVE_COLOR,
    fontWeight: '700',
  },
  labelInactive: {
    color: INACTIVE_COLOR,
    fontWeight: '500',
  },
});
