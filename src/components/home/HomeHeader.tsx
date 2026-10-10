import { useRouter } from 'expo-router';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { Spacing } from '@/constants/theme';

// ─── Colores de diseño (según PASSLP_REFERENCIA.md §2.1) ─────────────────────
const HEADER_BG = '#332F2B';
const SEARCH_BG = '#FFFFFF';
const SEARCH_PLACEHOLDER = '#999999';
const SEARCH_TEXT = '#1A1A1A';
const BTN_INGRESAR_BG = '#000000';
const BTN_INGRESAR_TEXT = '#FFFFFF';
const LOGO_TEXT_COLOR = '#FFFFFF';

// ─── Props ────────────────────────────────────────────────────────────────────
interface HomeHeaderProps {
  /** Texto actual del buscador. */
  searchQuery: string;
  /** Callback que se ejecuta al cambiar el texto del buscador. */
  onSearchChange: (text: string) => void;
}

// ─── Componente ───────────────────────────────────────────────────────────────

/**
 * Cabecera de la pantalla principal.
 *
 * Contiene (de izquierda a derecha): logotipo, buscador en píldora blanca
 * y botón "Ingresar" en píldora negra.
 * Fondo oscuro `#332F2B` según referencia PASSLP.
 */
export function HomeHeader({ searchQuery, onSearchChange }: HomeHeaderProps) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Logotipo */}
      <Text style={styles.logo} accessibilityRole="header">
        PassLP
      </Text>

      {/* Buscador */}
      <View style={styles.searchWrapper}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={onSearchChange}
          placeholder="Buscar Evento"
          placeholderTextColor={SEARCH_PLACEHOLDER}
          returnKeyType="search"
          clearButtonMode="while-editing"
          accessibilityLabel="Buscador de eventos"
        />
      </View>

      {/* Botón Ingresar */}
      <TouchableOpacity
        style={styles.btnIngresar}
        onPress={() => router.push('/login' as `/${string}`)}
        accessibilityRole="button"
        accessibilityLabel="Ingresar a tu cuenta"
      >
        <Text style={styles.btnIngresarText}>Ingresar</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    backgroundColor: HEADER_BG,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two + 4,
    gap: Spacing.two,
  },
  logo: {
    color: LOGO_TEXT_COLOR,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
    minWidth: 68,
  },
  searchWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SEARCH_BG,
    borderRadius: 999,
    paddingHorizontal: Spacing.two + 4,
    paddingVertical: Spacing.one + 2,
    gap: Spacing.one,
  },
  searchIcon: {
    fontSize: 14,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: SEARCH_TEXT,
    padding: 0,
    margin: 0,
  },
  btnIngresar: {
    backgroundColor: BTN_INGRESAR_BG,
    borderRadius: 999,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one + 2,
  },
  btnIngresarText: {
    color: BTN_INGRESAR_TEXT,
    fontSize: 12,
    fontWeight: '600',
  },
});

