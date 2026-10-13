import { useRef } from 'react';
import { Image } from 'expo-image';
import { Href, useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { PinIcon } from '@/components/ui/Icons';
import { Spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/useAppTheme';
import { EventItem } from '@/types';
import { formatCurrency } from '@/utils/formatters';
import { resolveFlyerSource } from '@/utils/imageUtils';

const BUY_BTN_BG = '#C84200';
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
 * Es un componente presentacional puro que adapta sus colores automáticamente
 * al tema del sistema para legibilidad óptima.
 */
export function EventCard({ event, onPress }: EventCardProps) {
  const router = useRouter();
  const { colors } = useAppTheme();
  const isNavigatingRef = useRef(false);

  function handlePress() {
    if (isNavigatingRef.current) return;
    isNavigatingRef.current = true;
    setTimeout(() => {
      isNavigatingRef.current = false;
    }, 800);

    if (onPress) {
      onPress();
    } else {
      router.push(`/event/${event.id}` as unknown as Href);
    }
  }

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.cardBg,
          borderColor: colors.cardBorder,
        },
      ]}
    >
      {/* Flyer interactivo (proporción 3:4) */}
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.88}
        accessible={false}
        importantForAccessibility="no"
        accessibilityElementsHidden={true}
      >
        <Image
          source={resolveFlyerSource(event.flyerUrl)}
          style={styles.flyer}
          contentFit="cover"
        />
      </TouchableOpacity>

      {/* Cuerpo de la tarjeta */}
      <View style={styles.body}>
        {/* Categoría */}
        <Text
          style={[styles.category, { color: colors.textMuted }]}
          numberOfLines={1}
          maxFontSizeMultiplier={1.3}
        >
          {event.category.toUpperCase()}
        </Text>

        {/* Título (espacio de 2 líneas reservado) */}
        <Text
          style={[styles.title, { color: colors.textPrimary }]}
          numberOfLines={2}
          ellipsizeMode="tail"
          maxFontSizeMultiplier={1.3}
        >
          {event.title}
        </Text>

        {/* Fecha y hora */}
        <Text
          style={[styles.meta, { color: colors.textSecondary }]}
          numberOfLines={1}
          maxFontSizeMultiplier={1.3}
        >
          {event.dateShort} · {event.time}
        </Text>

        {/* Lugar */}
        <View style={styles.venueRow}>
          <PinIcon size={13} color="#E85D04" style={styles.pinIcon} />
          <Text
            style={[styles.venue, { color: colors.textSecondary }]}
            numberOfLines={1}
            ellipsizeMode="tail"
            maxFontSizeMultiplier={1.3}
          >
            {event.venue.name}, {event.venue.city}
          </Text>
        </View>

        {/* Precio base y botón Comprar anclado */}
        <View style={styles.footer}>
          {event.ticketTiers.length > 0 && (
            <Text
              style={[styles.price, { color: colors.textPrimary }]}
              maxFontSizeMultiplier={1.3}
            >
              {'Desde '}
              {formatCurrency(Math.min(...event.ticketTiers.map((t) => t.price)))}
            </Text>
          )}
          <TouchableOpacity
            style={styles.buyButton}
            onPress={handlePress}
            activeOpacity={0.85}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityRole="button"
            accessibilityLabel={`Comprar entradas para ${event.title}`}
          >
            <Text style={styles.buyButtonText} maxFontSizeMultiplier={1.3}>
              Comprar
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
    flex: 1,
    height: '100%',
    borderRadius: 12,
    borderWidth: 1,
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
    flex: 1,
    padding: Spacing.three,
    gap: Spacing.one,
    justifyContent: 'flex-start',
  },
  category: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    lineHeight: 18,
    marginTop: Spacing.one,
    minHeight: 36,
  },
  meta: {
    fontSize: 11,
    marginTop: Spacing.one,
  },
  venueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  pinIcon: {
    width: 11,
    height: 11,
    flexShrink: 0,
  },
  venue: {
    fontSize: 11,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 'auto',
    paddingTop: Spacing.two,
  },
  price: {
    fontSize: 12,
    fontWeight: '700',
    flexShrink: 1,
  },
  buyButton: {
    backgroundColor: BUY_BTN_BG,
    minWidth: 76,
    height: 32,
    paddingHorizontal: Spacing.two + 4,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyButtonText: {
    color: BUY_BTN_TEXT,
    fontSize: 12,
    fontWeight: '700',
  },
});

