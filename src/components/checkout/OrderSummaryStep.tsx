import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ParkingBadgeIcon } from '../ui/Icons';
import { formatCurrency } from '@/utils/formatters';
import { CartTicketItem, EventItem, OrderPricing, ParkingVehicle } from '@/types';

interface OrderSummaryStepProps {
  event: EventItem;
  tickets: CartTicketItem[];
  parkingVehicles: ParkingVehicle[];
  pricing: OrderPricing;
  onNext: () => void;
  onBack: () => void;
}

/**
 * Paso 1 del Checkout: Revisá tu orden (S3.1).
 *
 * Muestra el aviso de estacionamiento si corresponde, el desglose de entradas
 * y vehículos, los subtotales con el 15% de costo por servicio y el total.
 */
export function OrderSummaryStep({
  event,
  tickets,
  parkingVehicles,
  pricing,
  onNext,
  onBack,
}: OrderSummaryStepProps) {
  return (
    <View style={styles.container}>
      {/* Aviso de estacionamiento si el evento lo posee */}
      {event.hasParking && (
        <View style={styles.parkingNoticeCard}>
          <ParkingBadgeIcon size={22} color="#0D4F9C" />
          <Text style={styles.parkingNoticeText}>
            Este evento cuenta con estacionamiento disponible.
          </Text>
        </View>
      )}

      {/* Tarjeta tipo Ticket / Carrito */}
      <View style={styles.ticketCard}>
        <View style={styles.ticketHeader}>
          <Text style={styles.ticketTitle}>TUS ENTRADAS</Text>
          <Text style={styles.eventSubtitle} numberOfLines={1} selectable={true}>
            {event.title}
          </Text>
        </View>

        {/* Lista de entradas */}
        <View style={styles.itemsList}>
          {tickets.map((item) => (
            <View key={item.ticketTierId} style={styles.ticketRow}>
              <View style={styles.ticketInfo}>
                <Text style={styles.ticketName}>{item.name}</Text>
                <Text style={styles.ticketQty}>
                  ({item.quantity} unidad{item.quantity > 1 ? 'es' : ''})
                </Text>
              </View>
              <Text style={styles.ticketPrice}>
                {formatCurrency(item.subtotal)}
              </Text>
            </View>
          ))}
        </View>

        {/* Lista de vehículos de estacionamiento (si hay) */}
        {parkingVehicles.length > 0 && (
          <View style={styles.parkingSection}>
            <View style={styles.divider} />
            <Text style={styles.parkingSectionTitle}>
              ESTACIONAMIENTO ({parkingVehicles.length}{' '}
              {parkingVehicles.length === 1 ? 'vehículo' : 'vehículos'})
            </Text>
            {parkingVehicles.map((v) => (
              <View key={v.id} style={styles.vehicleRow}>
                <View style={styles.vehicleInfo}>
                  <Text style={styles.vehicleModel}>
                    {v.model} ({v.vehicleType})
                  </Text>
                  <Text style={styles.vehiclePlate}>Patente: {v.plate}</Text>
                </View>
                <Text style={styles.vehiclePrice}>
                  {formatCurrency(v.price)}
                </Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.divider} />

        {/* Desglose de costos */}
        <View style={styles.costsBreakdown}>
          <View style={styles.costRow}>
            <Text style={styles.costLabel}>Costo de las entradas</Text>
            <Text style={styles.costValue}>
              {formatCurrency(pricing.ticketsSubtotal)}
            </Text>
          </View>

          {parkingVehicles.length > 0 && (
            <View style={styles.costRow}>
              <Text style={styles.costLabel}>Costo de estacionamiento</Text>
              <Text style={styles.costValue}>
                {formatCurrency(pricing.parkingSubtotal)}
              </Text>
            </View>
          )}

          <View style={styles.costRow}>
            <Text style={styles.costLabel}>
              Costo por servicio ({pricing.serviceFeePercentage}%)
            </Text>
            <Text style={styles.costValue}>
              {formatCurrency(pricing.serviceFeeAmount)}
            </Text>
          </View>
        </View>

        <View style={styles.dividerBold} />

        {/* Total */}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>TOTAL</Text>
          <Text style={styles.totalValue}>
            {formatCurrency(pricing.total)}
          </Text>
        </View>
      </View>

      {/* Botones de acción */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={onNext}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Siguiente paso: Ingresá tus datos"
        >
          <Text style={styles.nextButtonText}>SIGUIENTE</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Volver a la selección de entradas"
        >
          <Text style={styles.backButtonText}>ATRÁS</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 24,
  },
  parkingNoticeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  parkingNoticeText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#1E293B',
  },
  ticketCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 16,
  },
  ticketHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingBottom: 10,
    marginBottom: 12,
  },
  ticketTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: 0.5,
  },
  eventSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  itemsList: {
    gap: 10,
  },
  ticketRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ticketInfo: {
    flex: 1,
    paddingRight: 10,
  },
  ticketName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F2937',
  },
  ticketQty: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 1,
  },
  ticketPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  parkingSection: {
    marginTop: 8,
  },
  parkingSectionTitle: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#4B5563',
    marginBottom: 8,
    marginTop: 4,
    letterSpacing: 0.3,
  },
  vehicleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  vehicleInfo: {
    flex: 1,
    paddingRight: 10,
  },
  vehicleModel: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#1F2937',
  },
  vehiclePlate: {
    fontSize: 11,
    color: '#6B7280',
  },
  vehiclePrice: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#111827',
  },
  divider: {
    height: 1,
    backgroundColor: '#BABABA',
    marginVertical: 12,
  },
  dividerBold: {
    height: 1.5,
    backgroundColor: '#BABABA',
    marginVertical: 12,
  },
  costsBreakdown: {
    gap: 6,
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  costLabel: {
    fontSize: 12.5,
    color: '#4B5563',
  },
  costValue: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#1F2937',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 2,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '900',
    color: '#111827',
  },
  totalValue: {
    fontSize: 17,
    fontWeight: '900',
    color: '#111827',
  },
  actionsContainer: {
    gap: 10,
  },
  nextButton: {
    backgroundColor: '#54C1C3',
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#54C1C3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  nextButtonText: {
    color: '#332F2B',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  backButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#BCBCBC',
    paddingVertical: 13,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    color: '#332F2B',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
});

