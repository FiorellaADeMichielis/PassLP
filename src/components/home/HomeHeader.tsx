import { Image } from 'expo-image';
import { Href, useRouter } from 'expo-router';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { Spacing } from '@/constants/theme';

// ─── Colores de diseño (según PASSLP_REFERENCIA.md §2.1 y §9.1) ─────────────
const HEADER_BG = '#332F2B';
const SEARCH_BG = '#FFFFFF';
const SEARCH_PLACEHOLDER = '#999999';
const SEARCH_TEXT = '#1A1A1A';
const BTN_INGRESAR_BG = '#000000';
const BTN_INGRESAR_TEXT = '#FFFFFF';
const LOGO_TEXT_COLOR = '#F77F00'; // Naranja corporativo PASSLP

// ─── Icono de búsqueda en formato SVG vectorial ──────────────────────────────
const SEARCH_ICON_SVG =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="%23999999" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7.5"></circle><line x1="21" y1="21" x2="16.5" y2="16.5"></line></svg>';

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
 * Contiene (de izquierda a derecha): logotipo en naranja institucional, buscador en píldora blanca
 * con icono SVG vectorial y botón "Ingresar" en píldora negra.
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
        <Image
          source={{ uri: SEARCH_ICON_SVG }}
          style={styles.searchIcon}
          contentFit="contain"
          accessibilityLabel="Icono de lupa"
        />
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
        onPress={() => router.push('/login' as unknown as Href)}
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
    width: 14,
    height: 14,
    marginRight: 2,
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

