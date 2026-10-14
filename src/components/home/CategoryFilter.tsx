import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { EventCategory } from '@/types';


import { useAppTheme } from '@/hooks/useAppTheme';

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
 * Se adapta automáticamente al tema oscuro o claro del sistema.
 */
export function CategoryFilter({ categories, selected, onSelect }: CategoryFilterProps) {
  const { colors } = useAppTheme();

  return (
    <View style={styles.wrapper}>
      {/* Título de sección con línea */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Categorías</Text>
        <View style={[styles.line, { backgroundColor: colors.cardBorder }]} />
      </View>

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
              style={[
                styles.chip,
                {
                  backgroundColor: isSelected ? colors.chipSelectedBg : colors.chipBg,
                  borderColor: isSelected ? colors.chipSelectedBg : colors.chipBorder,
                },
              ]}
              onPress={() => onSelect(category)}
              activeOpacity={0.75}
              accessibilityRole="tab"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={`Categoría ${category}`}
              hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
            >
              <Text
                style={[
                  styles.chipText,
                  {
                    color: isSelected ? colors.chipSelectedText : colors.chipText,
                    fontWeight: isSelected ? '700' : '500',
                  },
                ]}
              >
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
  header: {
    paddingHorizontal: Spacing.three,
    marginBottom: Spacing.two,
    gap: Spacing.one,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  line: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginTop: 4,
  },
  scrollContent: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.three,
    gap: Spacing.two,
    alignItems: 'center',
  },
  chip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one + 2,
  },
  chipText: {
    fontSize: 12,
  },
});

