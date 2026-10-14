import { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';

import { CategoryFilter } from '@/components/home/CategoryFilter';
import { ExploreIcon } from '@/components/ui/Icons';
import { useAppTheme } from '@/hooks/useAppTheme';
import { eventsService } from '@/services';
import { EventCategory } from '@/types';

/**
 * Pantalla de Explorar eventos.
 *
 * Permite explorar y filtrar eventos por categoría, con accesibilidad,
 * tipografía responsiva y diseño institucional unificado.
 */
export default function ExploreScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const [selectedCategory, setSelectedCategory] = useState<EventCategory>('Todas');
  const [categories, setCategories] = useState<EventCategory[]>([]);

  useEffect(() => {
    async function load() {
      const cats = await eventsService.getCategories();
      setCategories(cats);
    }
    load();
  }, []);

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.headerBg }]}
      edges={['top']}
    >
      <StatusBar style={colors.statusBarStyle} />

      {/* Cabecera superior institucional */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.headerBg,
            borderBottomColor: colors.headerBorder,
          },
        ]}
      >
        <Text
          style={[styles.headerTitle, { color: '#FFFFFF' }]}
          maxFontSizeMultiplier={1.3}
          accessibilityRole="header"
        >
          Explorar
        </Text>
      </View>

      <ScrollView
        style={[styles.container, { backgroundColor: colors.screenBg }]}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Selector horizontal de categorías */}
        {categories.length > 0 && (
          <CategoryFilter
            categories={categories}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
        )}

        {/* Tarjeta de estado / información */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.cardBg,
              borderColor: colors.cardBorder,
            },
          ]}
        >
          <View style={styles.iconContainer}>
            <ExploreIcon size={44} color={colors.footerActive} />
          </View>

          <Text
            style={[styles.cardTitle, { color: colors.textPrimary }]}
            maxFontSizeMultiplier={1.3}
          >
            Nuevas experiencias en camino
          </Text>

          <Text
            style={[styles.cardDescription, { color: colors.textSecondary }]}
            maxFontSizeMultiplier={1.3}
            selectable
          >
            Estamos sumando recitales, fiestas, obras y festivales todas las semanas.
            Podés revisar todos los eventos confirmados en la cartelera principal.
          </Text>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push('/')}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Ver cartelera de inicio"
          >
            <Text style={styles.primaryButtonText} maxFontSizeMultiplier={1.3}>
              Ver cartelera de inicio
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    height: 52,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 32,
  },
  card: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    borderWidth: 1,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#332F2B',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  primaryButton: {
    backgroundColor: '#F77F00',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
