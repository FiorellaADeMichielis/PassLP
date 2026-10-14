import { useEffect, useRef, useState } from 'react';
import { Image } from 'expo-image';
import { useScrollToTop } from 'expo-router';
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Keyboard,
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
import { HomeHeader } from '@/components/home/HomeHeader';
import { useAppTheme } from '@/hooks/useAppTheme';
import { eventsService } from '@/services';
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
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<EventCategory>('Todas');
  const [categories, setCategories] = useState<EventCategory[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [featuredEvents, setFeaturedEvents] = useState<EventItem[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const [gridFadeAnim] = useState(() => new Animated.Value(1));

  // Soporte nativo para scroll to top al tocar la pestaña de Inicio
  useScrollToTop(scrollRef);

  // La búsqueda está activa cuando hay al menos un carácter con significado
  const isSearching = searchQuery.trim().length > 0;

  // ── Debounce de búsqueda (200ms) ──────────────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // ── Carga inicial: categorías, eventos destacados y catálogo ──────────────
  useEffect(() => {
    async function bootstrap() {
      try {
        const [cats, featured, initialEvents] = await Promise.all([
          eventsService.getCategories(),
          eventsService.getFeaturedEvents(),
          eventsService.getEvents(),
        ]);
        setCategories(cats);
        setFeaturedEvents(featured);
        setEvents(initialEvents);
      } finally {
        setIsInitialLoading(false);
      }
    }

    bootstrap();
  }, []);

  // ── Filtrado por búsqueda y categoría con transición suave ───────────────
  useEffect(() => {
    if (isInitialLoading) return;

    let cancel = false;

    // Desvanecimiento suave inicial al cambiar filtro
    Animated.timing(gridFadeAnim, {
      toValue: 0.25,
      duration: 100,
      useNativeDriver: true,
    }).start();

    async function applyFilters() {
      const filtered = await eventsService.getEvents(
        selectedCategory,
        debouncedQuery
      );

      if (!cancel) {
        setEvents(filtered);
        // Transición suave de entrada con los nuevos datos
        Animated.timing(gridFadeAnim, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }).start();
      }
    }

    applyFilters();

    return () => {
      cancel = true;
    };
  }, [debouncedQuery, selectedCategory, isInitialLoading, gridFadeAnim]);

  // ── Pull-to-refresh ──────────────────────────────────────────────────────
  async function handleRefresh() {
    setRefreshing(true);
    try {
      const [cats, featured, refreshedEvents] = await Promise.all([
        eventsService.getCategories(),
        eventsService.getFeaturedEvents(),
        eventsService.getEvents(selectedCategory, debouncedQuery),
      ]);
      setCategories(cats);
      setFeaturedEvents(featured);
      setEvents(refreshedEvents);
    } finally {
      setRefreshing(false);
    }
  }

  // ── Handlers de interacción ──────────────────────────────────────────────
  function handleCategorySelect(category: EventCategory) {
    setSelectedCategory(category);
  }

  function handleSearchChange(text: string) {
    setSearchQuery(text);
  }

  function handleResetToHome() {
    Keyboard.dismiss();
    setSearchQuery('');
    setDebouncedQuery('');
    setSelectedCategory('Todas');
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  }

  // ── Render Helpers ────────────────────────────────────────────────────────
  function renderEventItem({ item }: { item: EventItem }) {
    return (
      <View style={styles.cardWrapper}>
        <EventCard event={item} />
      </View>
    );
  }

  function renderEmptyState() {
    if (isInitialLoading) {
      return (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#F77F00" style={styles.loader} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Cargando eventos...
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyState}>
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          {isSearching
            ? `No encontramos eventos para "${searchQuery}".`
            : `No hay eventos disponibles en "${selectedCategory}".`}
        </Text>
      </View>
    );
  }

  if (isInitialLoading) {
    return (
      <SafeAreaView
        style={[styles.safeArea, { backgroundColor: colors.headerBg }]}
        edges={['top']}
      >
        <StatusBar style={colors.statusBarStyle} />
        <View style={[styles.fullLoaderContainer, { backgroundColor: colors.headerBg }]}>
          <View style={styles.fullLoaderContent}>
            <Image
              source={require('@/assets/splash-icon-dark.png')}
              style={styles.splashIconImage}
              contentFit="contain"
              accessibilityLabel="PassLP Logo"
            />
            <ActivityIndicator size="large" color="#F77F00" style={styles.splashLoader} />
            <Text style={[styles.splashLoadingText, { color: '#D0CBC5' }]}>
              Iniciando PassLP...
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.headerBg }]}
      edges={['top']}
    >
      <StatusBar style={colors.statusBarStyle} />

      {/* Cabecera superior con buscador */}
      <HomeHeader
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onLogoPress={handleResetToHome}
      />

      {/* Contenedor scrolleable vertical */}
      <ScrollView
        ref={scrollRef}
        style={[styles.scroll, { backgroundColor: colors.screenBg }]}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#F77F00']}
            tintColor="#F77F00"
          />
        }
      >
        {/* Carrusel de eventos destacados (se oculta durante la búsqueda) */}
        {featuredEvents.length > 0 && !isSearching && (
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

        {/* Grilla de eventos con transición suave */}
        <Animated.View style={{ opacity: gridFadeAnim }}>
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
        </Animated.View>
      </ScrollView>
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
    paddingBottom: 24,
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
    alignItems: 'stretch',
  },
  cardWrapper: {
    flex: 1,
  },
  loaderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    gap: 12,
  },
  loader: {
    marginBottom: 4,
  },
  loadingText: {
    fontSize: 14,
    fontWeight: '500',
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
  fullLoaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullLoaderContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 24,
  },
  splashIconImage: {
    width: 220,
    height: 70,
  },
  splashLoader: {
    marginTop: 8,
  },
  splashLoadingText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
