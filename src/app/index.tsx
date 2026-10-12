import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { CategoryFilter } from '@/components/home/CategoryFilter';
import { EventCard } from '@/components/home/EventCard';
import { FeaturedCarousel } from '@/components/home/FeaturedCarousel';
import { HomeFooter } from '@/components/home/HomeFooter';
import { HomeHeader } from '@/components/home/HomeHeader';
import { useAppTheme } from '@/hooks/useAppTheme';
import { eventsService } from '@/services/eventsService';
import { EventCategory, EventItem } from '@/types';

// ─── Pantalla principal ────────────────────────────────────────────────────────

/**
 * Pantalla principal (Smart screen).
 *
 * Orquesta el estado global de la pantalla de inicio: búsqueda, categoría
 * seleccionada, lista de eventos filtrados y eventos destacados.
 * Adapta su paleta y la barra superior al tema activo del sistema.
 */
export default function HomeScreen() {
  const { colors } = useAppTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<EventCategory>('Todas');
  const [categories, setCategories] = useState<EventCategory[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [featuredEvents, setFeaturedEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  // ── Carga inicial: categorías y eventos destacados ─────────────────────────
  useEffect(() => {
    async function bootstrap() {
      const [cats, featured] = await Promise.all([
        eventsService.getCategories(),
        eventsService.getFeaturedEvents(),
      ]);
      setCategories(cats);
      setFeaturedEvents(featured);
    }
    bootstrap();
  }, []);

  // ── Carga de eventos al cambiar filtros ────────────────────────────────────
  useEffect(() => {
    let isMounted = true;

    eventsService
      .getEvents(
        selectedCategory === 'Todas' ? undefined : selectedCategory,
        searchQuery.trim() || undefined,
      )
      .then((result) => {
        if (isMounted) {
          setEvents(result);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [selectedCategory, searchQuery]);

  // ── Handlers ───────────────────────────────────────────────────────────────
  function handleCategorySelect(category: EventCategory) {
    setLoading(true);
    setSelectedCategory(category);
  }

  function handleSearchChange(text: string) {
    setLoading(true);
    setSearchQuery(text);
  }

  async function handleRefresh() {
    setRefreshing(true);
    const [cats, featured, evts] = await Promise.all([
      eventsService.getCategories(),
      eventsService.getFeaturedEvents(),
      eventsService.getEvents(
        selectedCategory === 'Todas' ? undefined : selectedCategory,
        searchQuery.trim() || undefined,
      ),
    ]);
    setCategories(cats);
    setFeaturedEvents(featured);
    setEvents(evts);
    setRefreshing(false);
  }

  // ── Render helpers ─────────────────────────────────────────────────────────

  function renderEventItem({ item }: { item: EventItem }) {
    return (
      <View style={styles.cardWrapper}>
        <EventCard event={item} />
      </View>
    );
  }

  function renderEmptyState() {
    if (loading) return null;
    return (
      <View style={styles.emptyState}>
        <Text style={[styles.emptyText, { color: colors.textMuted }]}>
          No se encontraron eventos{searchQuery ? ` para "${searchQuery}"` : ''}.
        </Text>
      </View>
    );
  }

  // ── Layout ─────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.headerBg }]}
      edges={['top']}
    >
      <StatusBar style={colors.statusBarStyle} />

      {/* Header siempre visible arriba */}
      <HomeHeader searchQuery={searchQuery} onSearchChange={handleSearchChange} />

      <ScrollView
        ref={scrollRef}
        style={[styles.scroll, { backgroundColor: colors.screenBg }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#F77F00']}
            tintColor="#F77F00"
          />
        }
      >
        {/* Carrusel de destacados */}
        {featuredEvents.length > 0 && (
          <FeaturedCarousel events={featuredEvents} />
        )}

        {/* Filtro de categorías */}
        <CategoryFilter
          categories={categories}
          selected={selectedCategory}
          onSelect={handleCategorySelect}
        />

        {/* Título de sección */}
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Eventos</Text>

        {/* Grilla de eventos */}
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#E85D04"
            style={styles.loader}
            accessibilityLabel="Cargando eventos"
          />
        ) : (
          <FlatList
            data={events}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.row}
            renderItem={renderEventItem}
            ListEmptyComponent={renderEmptyState}
            scrollEnabled={false}
            contentContainerStyle={styles.grid}
          />
        )}
      </ScrollView>

      {/* Barra de navegación inferior fija (Sticky Bottom Tab Bar) */}
      <HomeFooter
        onPressHome={() => scrollRef.current?.scrollTo({ y: 0, animated: true })}
      />
    </SafeAreaView>
  );
}

// ─── Estilos ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 4,
  },
  grid: {
    paddingHorizontal: 12,
    paddingBottom: 28,
  },
  row: {
    gap: 12,
    marginBottom: 12,
  },
  cardWrapper: {
    flex: 1,
  },
  loader: {
    marginVertical: 40,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
  },
});
