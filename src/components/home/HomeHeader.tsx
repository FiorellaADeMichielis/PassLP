import { Image } from 'expo-image';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { SearchIcon } from '@/components/ui/Icons';
import { Spacing } from '@/constants/theme';


import { useAppTheme } from '@/hooks/useAppTheme';

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
 * Contiene (de izquierda a derecha): logotipo corporativo adaptativo (claro u oscuro),
 * buscador en píldora con icono SVG vectorial nativo y botón "Ingresar".
 * Se adapta automáticamente al tema del teléfono para garantizar contraste óptimo.
 */
export function HomeHeader({ searchQuery, onSearchChange }: HomeHeaderProps) {
  const { colors } = useAppTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.headerBg,
          borderBottomColor: colors.headerBorder,
        },
      ]}
    >
      {/* Logotipo oficial sobre fondo oscuro */}
      <Image
        source={require('@/assets/logo-on-dark.png')}
        style={styles.logoImage}
        contentFit="contain"
        accessibilityLabel="Logotipo PassLP"
      />

      {/* Buscador */}
      <View style={[styles.searchWrapper, { backgroundColor: colors.searchBg }]}>
        <SearchIcon size={15} color={colors.searchIcon} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: colors.searchInput }]}
          value={searchQuery}
          onChangeText={onSearchChange}
          placeholder="Buscar Evento"
          placeholderTextColor={colors.searchPlaceholder}
          returnKeyType="search"
          clearButtonMode="while-editing"
          accessibilityLabel="Buscador de eventos"
        />
      </View>

      {/* Botón Ingresar */}
      <TouchableOpacity
        style={[styles.btnIngresar, { backgroundColor: colors.btnIngresarBg }]}
        onPress={() =>
          Alert.alert('Ingresar', 'El inicio de sesión estará disponible próximamente.')
        }
        accessibilityRole="button"
        accessibilityLabel="Ingresar a tu cuenta"
      >
        <Text style={[styles.btnIngresarText, { color: colors.btnIngresarText }]}>
          Ingresar
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two + 4,
    gap: Spacing.two,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  logoImage: {
    width: 84,
    height: 28,
  },
  searchWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
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
    padding: 0,
    margin: 0,
  },
  btnIngresar: {
    borderRadius: 999,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one + 2,
  },
  btnIngresarText: {
    fontSize: 12,
    fontWeight: '600',
  },
});

