import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { EventCategory } from '@/types';

// ─── Colores de diseño (según PASSLP_REFERENCIA.md §2.3) ─────────────────────
const CHIP_BG = 'transparent';
const CHIP_BORDER = '#CCCCCC';
const CHIP_TEXT = '#333333';
const CHIP_SELECTED_BG = '#332F2B';
const CHIP_SELECTED_BORDER = '#332F2B';
const CHIP_SELECTED_TEXT = '#FFFFFF';

// ─── Props ────────────────────────────────────────────────────────────────────
interface CategoryFilterProps {
  /** Lista completa de categorías a mostrar. */
  categories: EventCategory[];
  /** Categoría actualmente seleccionada. */
  selected: EventCategory;
  /** Callback que se ejecuta al seleccionar una categoría. */
  onSelect: (category: EventCategory) => void;
}

// ─── Componente ───────────────────────────────────────────────────────────────

/**
 * Fila horizontal scrolleable de chips para filtrar eventos por categoría.
 *
 * El chip activo se muestra con fondo oscuro; los inactivos tienen
 * borde fino y fondo transparente, según el estilo de la referencia PASSLP.
 */
export function CategoryFilter({ categories, selected, onSelect }: CategoryFilterProps) {
  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        accessibilityRole="tablist"
      >
        {categories.map((category) => {
          const isSelected = category === selected;
          return (
            <TouchableOpacity
              key={category}
              style={[styles.chip, isSelected && styles.chipSelected]}
              onPress={() => onSelect(category)}
              accessibilityRole="tab"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={`Categoría ${category}`}
            >
              <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                {category}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: Spacing.two,
  },
  scrollContent: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.three,
    gap: Spacing.two,
    alignItems: 'center',
  },
  chip: {
    borderWidth: 1,
    borderColor: CHIP_BORDER,
    backgroundColor: CHIP_BG,
    borderRadius: 999,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one + 2,
  },
  chipSelected: {
    backgroundColor: CHIP_SELECTED_BG,
    borderColor: CHIP_SELECTED_BORDER,
  },
  chipText: {
    fontSize: 12,
    color: CHIP_TEXT,
    fontWeight: '500',
  },
  chipTextSelected: {
    color: CHIP_SELECTED_TEXT,
    fontWeight: '700',
  },
});
