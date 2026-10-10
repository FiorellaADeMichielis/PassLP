import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { EventItem } from '@/types';

// ─── Colores de diseño (según PASSLP_REFERENCIA.md) ─────────────────────────
const CARD_BG = '#FFFFFF';
const TITLE_COLOR = '#1A1A1A';
const SECONDARY_COLOR = '#666666';
const CATEGORY_COLOR = '#999999';
const BUY_BTN_BG = '#E85D04';
const BUY_BTN_TEXT = '#FFFFFF';
const SHADOW_COLOR = '#000000';

// ─── Props ────────────────────────────────────────────────────────────────────
interface EventCardProps {
  /** Datos del evento a mostrar en la tarjeta. */
  event: EventItem;
  /**
   * Callback opcional ejecutado al presionar la tarjeta o el botón "Comprar".
   * Si no se provee, la navegación es manejada internamente por el componente.
   */
  onPress?: () => void;
}

// ─── Componente ───────────────────────────────────────────────────────────────

/**
 * Tarjeta de evento para la grilla de la pantalla principal.
 *
 * Muestra flyer, título, fecha, hora, lugar y un botón de compra.
 * Es un componente presentacional puro: no accede a servicios directamente,
 * recibe los datos por props.
 */
export function EventCard({ event, onPress }: EventCardProps) {
  const router = useRouter();

  function handlePress() {
    if (onPress) {
      onPress();
    } else {
      router.push(`/event/${event.id}` as `/${string}`);
    }
  }

  return (
    <View style={styles.card}>
      {/* Flyer: proporción 3:4 */}
      <Image
        source={{ uri: event.flyerUrl }}
        style={styles.flyer}
        contentFit="cover"
        accessibilityLabel={`Flyer de ${event.title}`}
      />

      {/* Cuerpo de la tarjeta */}
      <View style={styles.body}>
        {/* Categoría */}
        <Text style={styles.category} numberOfLines={1}>
          {event.category.toUpperCase()}
        </Text>

        {/* Título */}
        <Text style={styles.title} numberOfLines={2}>
          {event.title}
        </Text>

        {/* Fecha y hora */}
        <Text style={styles.meta} numberOfLines={1}>
          {event.dateShort} · {event.time}
        </Text>

        {/* Lugar */}
        <Text style={styles.venue} numberOfLines={1}>
          📍 {event.venue.name}, {event.venue.city}
        </Text>

        {/* Precio base y botón Comprar */}
        <View style={styles.footer}>
          {event.ticketTiers.length > 0 && (
            <Text style={styles.price}>
              {'Desde '}
              {new Intl.NumberFormat('es-AR', {
                style: 'currency',
                currency: 'ARS',
                maximumFractionDigits: 0,
              })
                .format(Math.min(...event.ticketTiers.map((t) => t.price)))
                .replace('ARS', '$')
                .trim()}
            </Text>
          )}
          <TouchableOpacity
            style={styles.buyButton}
            onPress={handlePress}
            accessibilityRole="button"
            accessibilityLabel={`Comprar entradas para ${event.title}`}
          >
            <Text style={styles.buyButtonText}>Comprar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
    backgroundColor: CARD_BG,
    borderRadius: 12,
    overflow: 'hidden',
    // Sombra en iOS
    shadowColor: SHADOW_COLOR,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    // Sombra en Android
    elevation: 3,
  },
  flyer: {
    width: '100%',
    // Proporción 3:4 — el ancho lo determina el contenedor padre
    aspectRatio: 3 / 4,
  },
  body: {
    padding: Spacing.three,
    gap: Spacing.one,
  },
  category: {
    fontSize: 10,
    fontWeight: '600',
    color: CATEGORY_COLOR,
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: TITLE_COLOR,
    textTransform: 'uppercase',
    lineHeight: 18,
    marginTop: Spacing.one,
  },
  meta: {
    fontSize: 11,
    color: SECONDARY_COLOR,
    marginTop: Spacing.one,
  },
  venue: {
    fontSize: 11,
    color: SECONDARY_COLOR,
    marginTop: 2,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.two,
  },
  price: {
    fontSize: 12,
    fontWeight: '600',
    color: TITLE_COLOR,
    flexShrink: 1,
  },
  buyButton: {
    backgroundColor: BUY_BTN_BG,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one + 2,
    borderRadius: 999,
  },
  buyButtonText: {
    color: BUY_BTN_TEXT,
    fontSize: 12,
    fontWeight: '700',
  },
});

