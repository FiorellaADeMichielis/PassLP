import { useEffect, useRef, useState } from 'react';
import { Image } from 'expo-image';
import {
  ActivityIndicator,
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
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<EventCategory>('Todas');
  const [categories, setCategories] = useState<EventCategory[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [featuredEvents, setFeaturedEvents] = useState<EventItem[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

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

  // ── Carga de eventos al cambiar filtros o debounced query ─────────────────
  useEffect(() => {
    if (isInitialLoading) return;

    let isMounted = true;

    eventsService
      .getEvents(
        selectedCategory === 'Todas' ? undefined : selectedCategory,
        debouncedQuery.trim() || undefined,
      )
      .then((result) => {
        if (isMounted) {
          setEvents(result);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [selectedCategory, debouncedQuery, isInitialLoading]);

  // ── Handlers ───────────────────────────────────────────────────────────────
  function handleCategorySelect(category: EventCategory) {
    setSelectedCategory(category);
  }

  function handleSearchChange(text: string) {
    setSearchQuery(text);
    // Si el usuario borró todo el texto, limpiamos el debouncedQuery de inmediato
    if (text.trim() === '') {
      setDebouncedQuery('');
    }
  }

  /**
   * Restablece instantáneamente la búsqueda, el filtro de categorías y la posición
   * de scroll al tocar el logo de PassLP o el botón de inicio del footer.
   */
  function handleResetToHome() {
    Keyboard.dismiss();
    setSearchQuery('');
    setDebouncedQuery('');
    setSelectedCategory('Todas');
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  }

  async function handleRefresh() {
    setRefreshing(true);
    try {
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
    } finally {
      setRefreshing(false);
    }
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
    if (isInitialLoading) return null;
    return (
      <View style={styles.emptyState}>
        <Text style={[styles.emptyText, { color: colors.textMuted }]}>
          No se encontraron eventos{searchQuery.trim() ? ` para "${searchQuery.trim()}"` : ''}.
        </Text>
      </View>
    );
  }

  // ── Pantalla de carga inicial al abrir la app con splash-icon en alta definición ───
  if (isInitialLoading) {
    return (
      <SafeAreaView
        style={[styles.fullLoaderContainer, { backgroundColor: colors.screenBg }]}
        edges={['top', 'bottom']}
      >
        <StatusBar style={colors.statusBarStyle} />
        <View style={styles.fullLoaderContent}>
          <Image
            source={
              colors.screenBg === '#12100E'
                ? require('@/assets/splash-icon-dark.png')
                : require('@/assets/splash-icon.png')
            }
            style={styles.splashIconImage}
            contentFit="contain"
            priority="high"
            accessibilityLabel="PassLP"
          />
          <ActivityIndicator
            size="large"
            color="#F77F00"
            style={styles.splashLoader}
            accessibilityLabel="Cargando cartelera de eventos"
          />
          <Text style={[styles.splashLoadingText, { color: colors.textSecondary }]}>
            Cargando cartelera de eventos...
          </Text>
        </View>
      </SafeAreaView>
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
      <HomeHeader
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onLogoPress={handleResetToHome}
      />

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
        {/* Carrusel de destacados (se oculta automáticamente al buscar) */}
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

        {/* Grilla de eventos */}
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
      </ScrollView>

      {/* Barra de navegación inferior fija (Sticky Bottom Tab Bar) */}
      <HomeFooter onPressHome={handleResetToHome} currentTab="inicio" />
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
