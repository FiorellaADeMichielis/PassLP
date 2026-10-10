import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Dimensions, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';

import { EventItem } from '@/types';

// ─── Constantes de layout ─────────────────────────────────────────────────────
const SCREEN_WIDTH = Dimensions.get('window').width;

/** Ancho del póster central destacado. */
const FEATURED_WIDTH = SCREEN_WIDTH * 0.65;
/** Ancho de los pósteres laterales (efecto coverflow). */
const SIDE_WIDTH = SCREEN_WIDTH * 0.42;

const CARD_RADIUS = 12;
const SHADOW_COLOR = '#000000';

// ─── Props ────────────────────────────────────────────────────────────────────
interface FeaturedCarouselProps {
  /** Lista de eventos destacados a mostrar en el carrusel. */
  events: EventItem[];
}

// ─── Componente ───────────────────────────────────────────────────────────────

/**
 * Carrusel horizontal de eventos destacados.
 *
 * Muestra únicamente el flyer del evento. Los ítems tienen diferentes tamaños
 * para sugerir el efecto coverflow visto en la referencia PASSLP §2.2.
 * Al tocar un póster navega al detalle del evento.
 */
export function FeaturedCarousel({ events }: FeaturedCarouselProps) {
  const router = useRouter();

  if (events.length === 0) return null;

  return (
    <FlatList
      data={events}
      keyExtractor={(item) => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      snapToInterval={FEATURED_WIDTH + 16}
      decelerationRate="fast"
      contentContainerStyle={styles.listContent}
      renderItem={({ item, index }) => {
        const isCentral = index === 0;
        return (
          <TouchableOpacity
            onPress={() => router.push(`/event/${item.id}` as `/${string}`)}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel={`Evento destacado: ${item.title}`}
          >
            <View style={[styles.posterWrapper, isCentral ? styles.central : styles.side]}>
              <Image
                source={{ uri: item.flyerUrl }}
                style={styles.poster}
                contentFit="cover"
                accessibilityLabel={`Flyer de ${item.title}`}
              />
            </View>
          </TouchableOpacity>
        );
      }}
    />
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 16,
    gap: 12,
    alignItems: 'center',
    paddingVertical: 12,
  },
  posterWrapper: {
    borderRadius: CARD_RADIUS,
    overflow: 'hidden',
    // Sombra en iOS
    shadowColor: SHADOW_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    // Sombra en Android
    elevation: 5,
  },
  central: {
    width: FEATURED_WIDTH,
    // Proporción 3:4
    height: FEATURED_WIDTH * (4 / 3),
  },
  side: {
    width: SIDE_WIDTH,
    // Los laterales son más pequeños y desplazados
    height: SIDE_WIDTH * (4 / 3) * 0.88,
  },
  poster: {
    width: '100%',
    height: '100%',
  },
});

