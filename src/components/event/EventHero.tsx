import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import {
  CalendarIcon,
  ChevronLeftIcon,
  ClockIcon,
  PinIcon,
} from '@/components/ui/Icons';
import { Palette, Spacing } from '@/constants/theme';
import { EventItem } from '@/types';
import { resolveFlyerSource } from '@/utils/imageUtils';

interface EventHeroProps {
  /** Evento actual para renderizar el bloque Hero. */
  event: EventItem;
}

/**
 * Bloque Hero superior de la pantalla de detalle del evento.
 *
 * Muestra el flyer, la categoría, el título, la fecha con hora y el lugar
 * sobre un fondo personalizado con los tonos del flyer.
 * Incluye barra de navegación con botón volver.
 */
export function EventHero({ event }: EventHeroProps) {
  const router = useRouter();
  const [bgStart] = event.heroBgColors || ['#1E1A18', '#100D0B'];

  return (
    <View style={[styles.container, { backgroundColor: bgStart }]}>
      {/* Barra superior de navegación interna */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace('/');
            }
          }}
          accessibilityRole="button"
          accessibilityLabel="Volver a la pantalla anterior"
        >
          <ChevronLeftIcon size={20} color="#FFFFFF" />
          <Text style={styles.backText}>Volver</Text>
        </TouchableOpacity>

        <Image
          source={require('@/assets/logo-on-dark.png')}
          style={styles.topLogoImage}
          contentFit="contain"
          accessibilityLabel="Logotipo PassLP"
        />

        <View style={styles.placeholderRight} />
      </View>

      {/* Contenido principal del Hero */}
      <View style={styles.content}>
        {/* Flyer central */}
        <View style={styles.flyerWrapper}>
          <Image
            source={resolveFlyerSource(event.flyerUrl)}
            style={styles.flyer}
            contentFit="cover"
            accessibilityLabel={`Flyer oficial de ${event.title}`}
          />
        </View>

        {/* Metadatos del evento */}
        <View style={styles.metaContainer}>
          <Text style={styles.category}>{event.category.toUpperCase()}</Text>

          <Text style={styles.title} selectable={true}>
            {event.title}
          </Text>

          {/* Fecha y hora con iconos SVG */}
          <View style={styles.infoRow}>
            <CalendarIcon size={14} color="#F77F00" />
            <Text style={styles.infoText} selectable={true}>
              {event.date}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <ClockIcon size={14} color="#F77F00" />
            <Text style={styles.infoText} selectable={true}>
              {event.time}
            </Text>
          </View>

          {/* Lugar y dirección */}
          <View style={styles.infoRow}>
            <PinIcon size={14} color="#F77F00" />
            <Text style={styles.infoText} selectable={true}>
              {event.venue.name} · {event.venue.address}, {event.venue.city}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    paddingBottom: Spacing.four,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  backText: {
    color: Palette.white,
    fontSize: 13,
    fontWeight: '600',
  },
  topLogoImage: {
    width: 80,
    height: 24,
  },
  placeholderRight: {
    width: 60,
  },
  content: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    gap: Spacing.three,
  },
  flyerWrapper: {
    alignSelf: 'center',
    width: 220,
    aspectRatio: 3 / 4,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: Palette.black,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
    backgroundColor: Palette.black,
  },
  flyer: {
    width: '100%',
    height: '100%',
  },
  metaContainer: {
    gap: 6,
  },
  category: {
    fontSize: 11,
    fontWeight: '700',
    color: '#E0DDD9',
    letterSpacing: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: Palette.white,
    textTransform: 'uppercase',
    lineHeight: 26,
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#F0ECE8',
    flexShrink: 1,
    lineHeight: 18,
  },
});

