import { useState } from 'react';
import { Image } from 'expo-image';
import { Href, useRouter } from 'expo-router';
import {
  Animated,
  Dimensions,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import { EventItem } from '@/types';
import { resolveFlyerSource } from '@/utils/imageUtils';

// ─── Constantes de layout ─────────────────────────────────────────────────────
const SCREEN_WIDTH = Dimensions.get('window').width;

/** Ancho base de cada póster en el carrusel. */
const ITEM_WIDTH = Math.round(SCREEN_WIDTH * 0.65);
/** Espaciado entre pósteres. */
const SPACING = 14;
/** Intervalo de snap para centrar un póster en cada parada. */
const SNAP_INTERVAL = ITEM_WIDTH + SPACING;
/** Relleno lateral para que el primer y último elemento queden centrados. */
const SIDE_SPACER = Math.round((SCREEN_WIDTH - ITEM_WIDTH) / 2);

const CARD_RADIUS = 14;
const SHADOW_COLOR = '#000000';

// ─── Props ────────────────────────────────────────────────────────────────────
interface FeaturedCarouselProps {
  /** Lista de eventos destacados a mostrar en el carrusel. */
  events: EventItem[];
}

// ─── Componente ───────────────────────────────────────────────────────────────

/**
 * Carrusel horizontal animado de eventos destacados.
 *
 * Interpola dinámicamente la escala y opacidad según el desplazamiento (scrollX),
 * destacando en grande el póster que se encuentra en el medio y achicando
 * proporcionalmente los que se mueven hacia los costados.
 */
export function FeaturedCarousel({ events }: FeaturedCarouselProps) {
  const router = useRouter();
  const [scrollX] = useState(() => new Animated.Value(0));

  if (events.length === 0) return null;

  return (
    <View style={styles.container}>
      <Animated.FlatList
        data={events}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={SNAP_INTERVAL}
        decelerationRate="fast"
        bounces={false}
        contentContainerStyle={styles.listContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: Platform.OS !== 'web' }
        )}
        scrollEventThrottle={16}
        renderItem={({ item, index }) => {
          // Rango de entrada basado en la posición de este ítem
          const inputRange = [
            (index - 1) * SNAP_INTERVAL,
            index * SNAP_INTERVAL,
            (index + 1) * SNAP_INTERVAL,
          ];

          // El ítem centrado tiene escala 1.0; al alejarse hacia los lados se achica a 0.82
          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.82, 1, 0.82],
            extrapolate: 'clamp',
          });

          // Reducción sutil de opacidad en los ítems laterales
          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.65, 1, 0.65],
            extrapolate: 'clamp',
          });

          return (
            <TouchableOpacity
              onPress={() => router.push(`/event/${item.id}` as unknown as Href)}
              activeOpacity={0.9}
              accessibilityRole="button"
              accessibilityLabel={`Evento destacado: ${item.title}`}
            >
              <Animated.View
                style={[
                  styles.posterWrapper,
                  {
                    transform: [{ scale }],
                    opacity,
                  },
                ]}
              >
                <Image
                  source={resolveFlyerSource(item.flyerUrl)}
                  style={styles.poster}
                  contentFit="cover"
                  accessibilityLabel={`Flyer de ${item.title}`}
                />
              </Animated.View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  listContent: {
    paddingHorizontal: SIDE_SPACER - SPACING / 2,
    alignItems: 'center',
  },
  posterWrapper: {
    width: ITEM_WIDTH,
    // Proporción 3:4
    height: Math.round(ITEM_WIDTH * (4 / 3)),
    marginHorizontal: SPACING / 2,
    borderRadius: CARD_RADIUS,
    overflow: 'hidden',
    // Sombra en iOS
    shadowColor: SHADOW_COLOR,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    // Sombra en Android
    elevation: 6,
    backgroundColor: '#E0E0E0',
  },
  poster: {
    width: '100%',
    height: '100%',
  },
});
