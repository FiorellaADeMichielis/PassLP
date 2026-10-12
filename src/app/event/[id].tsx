import { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { EventAbout } from '@/components/event/EventAbout';
import { EventHero } from '@/components/event/EventHero';
import { ParkingSection } from '@/components/event/ParkingSection';
import { TicketTierItem } from '@/components/event/TicketTierItem';
import { Spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/useAppTheme';
import { eventsService } from '@/services/eventsService';
import { EventItem, ParkingVehicle } from '@/types';

// ─── Colores según PASSLP_REFERENCIA.md §3.2, §3.4 y §9.1 ───────────────────
const BTN_CONTINUAR_ACTIVE_BG = '#54C1C3'; // Teal activo PASSLP
const BTN_CONTINUAR_ACTIVE_TEXT = '#332F2B';
const BTN_CONTINUAR_DISABLED_BG = '#A4CFD0'; // Teal atenuado PASSLP
const BTN_CONTINUAR_DISABLED_TEXT = '#8E8E8E';

/**
 * Pantalla de Detalle del Evento (S2).
 *
 * Muestra el bloque Hero superior, la lista de lotes/tandas de tickets,
 * la sección desplegable de estacionamiento, la descripción del evento
 * y la barra flotante inferior con el botón "CONTINUAR" deshabilitado/habilitado
 * según la cantidad de tickets seleccionados.
 */
export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();

  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);

  // Estado del carrito temporal para este evento
  const [ticketQuantities, setTicketQuantities] = useState<Record<string, number>>({});
  const [addedVehicles, setAddedVehicles] = useState<ParkingVehicle[]>([]);

  // ── Carga del evento ────────────────────────────────────────────────────────
  useEffect(() => {
    let isMounted = true;

    if (id) {
      eventsService.getEventById(id).then((found) => {
        if (isMounted) {
          setEvent(found || null);
          setLoading(false);
        }
      });
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

  // ── Handlers de tickets ─────────────────────────────────────────────────────
  function handleQuantityChange(tierId: string, quantity: number) {
    setTicketQuantities((prev) => ({
      ...prev,
      [tierId]: quantity,
    }));
  }

  // ── Handlers de estacionamiento ─────────────────────────────────────────────
  function handleAddVehicle(vehicle: ParkingVehicle) {
    setAddedVehicles((prev) => [...prev, vehicle]);
  }

  function handleRemoveVehicle(vehicleId: string) {
    setAddedVehicles((prev) => prev.filter((v) => v.id !== vehicleId));
  }

  // ── Cálculos de carrito ─────────────────────────────────────────────────────
  const totalTicketsCount = Object.values(ticketQuantities).reduce(
    (acc, qty) => acc + qty,
    0
  );

  const ticketsSubtotal = event
    ? event.ticketTiers.reduce((acc, tier) => {
        const qty = ticketQuantities[tier.id] || 0;
        return acc + tier.price * qty;
      }, 0)
    : 0;

  const parkingSubtotal = addedVehicles.reduce((acc, v) => acc + v.price, 0);
  const grandTotal = ticketsSubtotal + parkingSubtotal;

  const canContinue = totalTicketsCount > 0;

  function handleContinue() {
    if (!canContinue || !event) return;

    router.push({
      pathname: `/checkout/${event.id}` as any,
      params: {
        tickets: JSON.stringify(ticketQuantities),
        vehicles: JSON.stringify(addedVehicles),
      },
    });
  }

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    })
      .format(amount)
      .replace('ARS', '$')
      .trim();

  // ── Render de estados de carga y error ──────────────────────────────────────
  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F77F00" />
        <Text style={styles.loadingText}>Cargando evento...</Text>
      </SafeAreaView>
    );
  }

  if (!event) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Evento no encontrado</Text>
        <Text style={styles.errorSubtitle}>
          El evento seleccionado no existe o no se encuentra disponible.
        </Text>
        <TouchableOpacity
          style={styles.errorBtn}
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace('/');
            }
          }}
        >
          <Text style={styles.errorBtnText}>Volver a la cartelera</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const [bgStart] = event?.heroBgColors || ['#1E1A18', '#100D0B'];

  // ── Layout principal ────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: bgStart }]} edges={['top']}>
      <StatusBar style="light" />
      <ScrollView
        style={[styles.scroll, { backgroundColor: colors.screenBg }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Bloque Hero superior */}
        <EventHero event={event} />

        <View style={[styles.body, { backgroundColor: colors.screenBg }]}>
          {/* 2. Sección TICKETS */}
          <View
            style={[
              styles.ticketsSection,
              { backgroundColor: colors.cardBg, borderColor: colors.cardBorder },
            ]}
          >
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>TICKETS</Text>
              <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
                Selecciona la cantidad de entradas que deseas
              </Text>
            </View>

            <View style={styles.tiersList}>
              {event.ticketTiers.map((tier) => (
                <TicketTierItem
                  key={tier.id}
                  tier={tier}
                  quantity={ticketQuantities[tier.id] || 0}
                  onChangeQuantity={(qty) => handleQuantityChange(tier.id, qty)}
                />
              ))}
            </View>
          </View>

          {/* 3. Sección ESTACIONAMIENTO (si el evento lo ofrece) */}
          {event.hasParking && event.parkingOptions && (
            <ParkingSection
              options={event.parkingOptions}
              addedVehicles={addedVehicles}
              onAddVehicle={handleAddVehicle}
              onRemoveVehicle={handleRemoveVehicle}
            />
          )}

          {/* 4. Sección SOBRE EL EVENTO */}
          <EventAbout about={event.about} />
        </View>
      </ScrollView>

      {/* 5. Barra inferior fija (Sticky Bottom Bar) con botón CONTINUAR */}
      <View
        style={[
          styles.bottomBar,
          {
            backgroundColor: colors.cardBg,
            borderTopColor: colors.cardBorder,
            paddingBottom: Math.max(insets.bottom, 12),
          },
        ]}
      >
        <View style={styles.summaryRow}>
          <View>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
              {totalTicketsCount > 0
                ? `${totalTicketsCount} entrada${totalTicketsCount > 1 ? 's' : ''}`
                : 'Selecciona tus entradas'}
            </Text>
            {totalTicketsCount > 0 && (
              <Text style={[styles.summaryTotal, { color: colors.textPrimary }]}>
                {formatCurrency(grandTotal)}
              </Text>
            )}
          </View>

          <TouchableOpacity
            style={[
              styles.continueButton,
              canContinue
                ? styles.continueButtonActive
                : styles.continueButtonDisabled,
            ]}
            onPress={handleContinue}
            disabled={!canContinue}
            accessibilityRole="button"
            accessibilityLabel="Continuar con la compra"
          >
            <Text
              style={[
                styles.continueButtonText,
                canContinue
                  ? styles.continueButtonTextActive
                  : styles.continueButtonTextDisabled,
              ]}
            >
              CONTINUAR
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
  },
  loadingText: {
    fontSize: 14,
    color: '#666666',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.four,
    gap: Spacing.two,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  errorSubtitle: {
    fontSize: 13,
    color: '#666666',
    textAlign: 'center',
  },
  errorBtn: {
    marginTop: Spacing.two,
    backgroundColor: '#332F2B',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    borderRadius: 8,
  },
  errorBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  body: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
  },
  ticketsSection: {
    borderRadius: 14,
    padding: Spacing.three,
    marginVertical: Spacing.two,
    borderWidth: 1,
  },
  sectionHeader: {
    marginBottom: Spacing.two,
    gap: 2,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1A1A1A',
    letterSpacing: 0.5,
  },
  sectionSubtitle: {
    fontSize: 11,
    color: '#777777',
  },
  tiersList: {
    gap: 10,
  },
  bottomBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    paddingTop: 10,
    paddingHorizontal: Spacing.three,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  summaryLabel: {
    fontSize: 11,
    color: '#666666',
  },
  summaryTotal: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  continueButton: {
    flex: 1,
    maxWidth: 200,
    paddingVertical: 13,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonActive: {
    backgroundColor: BTN_CONTINUAR_ACTIVE_BG,
  },
  continueButtonDisabled: {
    backgroundColor: BTN_CONTINUAR_DISABLED_BG,
  },
  continueButtonText: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  continueButtonTextActive: {
    color: BTN_CONTINUAR_ACTIVE_TEXT,
  },
  continueButtonTextDisabled: {
    color: BTN_CONTINUAR_DISABLED_TEXT,
  },
});

