import React, { useRef, useState } from 'react';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import {
  Animated,
  Platform,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';

import { EventItem } from '@/types';
import { resolveFlyerSource } from '@/utils/imageUtils';

// ─── Props ────────────────────────────────────────────────────────────────────
interface FeaturedCarouselProps {
  /** Lista de eventos destacados a mostrar en el carrusel. */
  events: EventItem[];
}

// ─── Componente ───────────────────────────────────────────────────────────────

/**
 * Carrusel horizontal animado de eventos destacados con centrado geométrico perfecto.
 *
 * Muestra los eventos destacados en tarjetas con relación de aspecto 3:4.
 * Cada póster activo se alinea exactamente en el centro horizontal de la pantalla
 * con escala completa (1.0) y opacidad (1.0), mientras los laterales se reducen armónicamente.
 */
export function FeaturedCarousel({ events }: FeaturedCarouselProps) {
  const router = useRouter();
  const { width: screenWidth } = useWindowDimensions();
  const listRef = useRef<Animated.FlatList>(null);
  const [scrollX] = useState(() => new Animated.Value(0));

  // Ancho del póster (72% del ancho visible de la pantalla)
  const itemWidth = Math.round(screenWidth * 0.72);
  const spacing = 14;
  const snapInterval = itemWidth + spacing;
  // Espaciador lateral para centrar perfectamente cada celda en el viewport
  const sideSpacer = Math.round((screenWidth - snapInterval) / 2);

  if (events.length === 0) return null;

  return (
    <View style={styles.container}>
      <Animated.FlatList
        ref={listRef}
        data={events}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={snapInterval}
        snapToAlignment="start"
        decelerationRate="fast"
        disableIntervalMomentum={true}
        bounces={false}
        contentContainerStyle={[
          styles.listContent,
          { paddingHorizontal: sideSpacer },
        ]}
        getItemLayout={(_, index) => ({
          length: snapInterval,
          offset: snapInterval * index,
          index,
        })}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: Platform.OS !== 'web' },
        )}
        onMomentumScrollEnd={(e) => {
          if (events.length <= 1) return;
          const offsetX = e.nativeEvent.contentOffset.x;
          const currentIndex = Math.round(offsetX / snapInterval);
          if (currentIndex >= events.length) {
            listRef.current?.scrollToOffset({
              offset: 0,
              animated: true,
            });
          }
        }}
        scrollEventThrottle={16}
        renderItem={({ item, index }) => {
          const inputRange = [
            (index - 1) * snapInterval,
            index * snapInterval,
            (index + 1) * snapInterval,
          ];

          // El ítem centrado tiene escala 1.0; los laterales se reducen suavemente a 0.85
          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.85, 1, 0.85],
            extrapolate: 'clamp',
          });

          // Opacidad sutil en los laterales
          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.7, 1, 0.7],
            extrapolate: 'clamp',
          });

          return (
            <TouchableOpacity
              style={[styles.itemCell, { width: snapInterval }]}
              onPress={() => router.push({ pathname: '/event/[id]', params: { id: item.id } })}
              activeOpacity={0.9}
              accessibilityRole="button"
              accessibilityLabel={`Evento destacado: ${item.title}`}
            >
              <Animated.View
                style={[
                  styles.posterWrapper,
                  {
                    width: itemWidth,
                    height: Math.round(itemWidth * (4 / 3)),
                    backgroundColor: '#1E1B18',
                    transform: [{ scale }],
                    opacity,
                  },
                ]}
              >
                <Image
                  source={resolveFlyerSource(item.flyerUrl)}
                  placeholder={require('@/assets/icon.png')}
                  placeholderContentFit="contain"
                  style={styles.poster}
                  contentFit="cover"
                  contentPosition="center"
                  transition={0}
                  cachePolicy="memory-disk"
                  priority="high"
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

const CARD_RADIUS = 14;
const SHADOW_COLOR = '#000000';

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  listContent: {
    alignItems: 'center',
  },
  itemCell: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  posterWrapper: {
    borderRadius: CARD_RADIUS,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    // Sombra en iOS
    shadowColor: SHADOW_COLOR,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    // Sombra en Android
    elevation: 6,
  },
  poster: {
    width: '100%',
    height: '100%',
  },
});
