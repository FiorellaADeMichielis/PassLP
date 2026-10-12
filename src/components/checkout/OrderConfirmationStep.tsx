import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ShieldCheckIcon } from '../ui/Icons';
import { checkoutService } from '@/services/checkoutService';
import {
  AttendeeData,
  BuyerData,
  CartTicketItem,
  EventItem,
  OrderPricing,
  ParkingVehicle,
} from '@/types';

interface OrderConfirmationStepProps {
  event: EventItem;
  tickets: CartTicketItem[];
  parkingVehicles: ParkingVehicle[];
  pricing: OrderPricing;
  buyer: BuyerData;
  attendees: AttendeeData[];
  onConfirm: () => void;
  onBack: () => void;
}

/**
 * Paso final del Checkout: Confirmar compra (S3.4 / S3 final).
 *
 * Muestra el resumen del comprador, detalle del carrito con la regla
 * del 15% de servicio aplicada a entradas y estacionamiento, y el botón
 * para avanzar a la simulación de pago (S4).
 */
export function OrderConfirmationStep({
  event,
  tickets,
  parkingVehicles,
  pricing,
  buyer,
  attendees,
  onConfirm,
  onBack,
}: OrderConfirmationStepProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const cartCost = pricing.ticketsSubtotal + pricing.parkingSubtotal;

  function handleConfirmPress() {
    if (isSubmitting) return;
    setIsSubmitting(true);
    onConfirm();
  }

  return (
    <View style={styles.container}>
      {/* Título Principal */}
      <View style={styles.card}>
        <Text style={styles.mainTitle}>Confirmá tu compra</Text>
        <Text style={styles.eventTitle}>{event.title}</Text>
        <Text style={styles.eventDate}>
          {event.date} • {event.time}
        </Text>
      </View>

      {/* Sección COMPRADOR */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>COMPRADOR</Text>
        <View style={styles.dividerLight} />

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Nombre y Apellido</Text>
          <Text style={styles.infoValue}>
            {buyer.firstName} {buyer.lastName}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>DNI</Text>
          <Text style={styles.infoValue}>{buyer.dni}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Teléfono</Text>
          <Text style={styles.infoValue}>{buyer.phone}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email</Text>
          <Text style={styles.infoValue}>{buyer.email}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Provincia</Text>
          <Text style={styles.infoValue}>{buyer.province}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Mismo titular en todas las entradas</Text>
          <Text style={styles.infoValue}>
            {buyer.allTicketsSameName ? 'Sí' : 'No'}
          </Text>
        </View>

        {/* Detalle de asistentes si no es el mismo titular */}
        {!buyer.allTicketsSameName && attendees.length > 0 && (
          <View style={styles.attendeesContainer}>
            <View style={styles.dividerLight} />
            <Text style={styles.subSectionTitle}>ASISTENTES ASIGNADOS</Text>
            {attendees.map((att) => (
              <View key={att.id} style={styles.attendeeRow}>
                <Text style={styles.attendeeBadge}>#{att.attendeeNumber}</Text>
                <Text style={styles.attendeeName}>
                  {att.firstName} {att.lastName}
                </Text>
                <Text style={styles.attendeeDni}>DNI {att.dni}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Sección TUS ENTRADAS / TU CARRITO */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>TUS ENTRADAS</Text>
        <Text style={styles.cartNote}>
          Confirmás distintos tipos de ítems en una sola compra.
        </Text>
        <View style={styles.dividerLight} />

        {/* Desglose de entradas */}
        {tickets.map((t) => (
          <View key={t.ticketTierId} style={styles.itemRow}>
            <View style={styles.itemTextContainer}>
              <Text style={styles.itemName}>{t.name}</Text>
              <Text style={styles.itemQuantity}>
                {t.quantity} unidad{t.quantity > 1 ? 'es' : ''}
              </Text>
            </View>
            <Text style={styles.itemPrice}>
              {checkoutService.formatCurrency(t.subtotal)}
            </Text>
          </View>
        ))}

        {/* Desglose de vehículos */}
        {parkingVehicles.map((v) => (
          <View key={v.id} style={styles.itemRow}>
            <View style={styles.itemTextContainer}>
              <Text style={styles.itemName}>
                Estacionamiento ({v.model} - {v.vehicleType})
              </Text>
              <Text style={styles.itemQuantity}>Patente: {v.plate}</Text>
            </View>
            <Text style={styles.itemPrice}>
              {checkoutService.formatCurrency(v.price)}
            </Text>
          </View>
        ))}

        <View style={styles.divider} />

        {/* Totales */}
        <View style={styles.costRow}>
          <Text style={styles.costLabel}>Costo del carrito</Text>
          <Text style={styles.costValue}>
            {checkoutService.formatCurrency(cartCost)}
          </Text>
        </View>

        <View style={styles.costRow}>
          <Text style={styles.costLabel}>
            Costo por servicio ({pricing.serviceFeePercentage}%)
          </Text>
          <Text style={styles.costValue}>
            {checkoutService.formatCurrency(pricing.serviceFeeAmount)}
          </Text>
        </View>

        <View style={styles.dividerBold} />

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total estimado</Text>
          <Text style={styles.totalValue}>
            {checkoutService.formatCurrency(pricing.total)}
          </Text>
        </View>
      </View>

      {/* Sello de seguridad */}
      <View style={styles.securityBadge}>
        <ShieldCheckIcon size={18} color="#1B9F00" />
        <Text style={styles.securityText}>
          Transacción protegida. Tus datos están seguros y encriptados.
        </Text>
      </View>

      {/* Botones de acción */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.confirmButton, isSubmitting && styles.confirmButtonDisabled]}
          onPress={handleConfirmPress}
          disabled={isSubmitting}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Continuar al pago"
        >
          <Text style={styles.confirmButtonText}>
            {isSubmitting ? 'PROCESANDO...' : 'CONTINUAR AL PAGO'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Volver al paso anterior"
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
  card: {
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
    marginBottom: 14,
  },
  mainTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 4,
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#332F2B',
  },
  eventDate: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: 0.5,
  },
  subSectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#4B5563',
    marginBottom: 8,
    letterSpacing: 0.4,
  },
  cartNote: {
    fontSize: 11.5,
    color: '#6B7280',
    marginTop: 2,
    marginBottom: 8,
  },
  dividerLight: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#BABABA',
    marginVertical: 10,
  },
  dividerBold: {
    height: 1.5,
    backgroundColor: '#BABABA',
    marginVertical: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  infoLabel: {
    fontSize: 12,
    color: '#6B7280',
    flex: 1,
  },
  infoValue: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'right',
    flex: 1.2,
  },
  attendeesContainer: {
    marginTop: 4,
  },
  attendeeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 3,
  },
  attendeeBadge: {
    backgroundColor: '#E5E7EB',
    color: '#374151',
    fontSize: 10,
    fontWeight: '700',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  attendeeName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  attendeeDni: {
    fontSize: 11.5,
    color: '#6B7280',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  itemTextContainer: {
    flex: 1,
    paddingRight: 8,
  },
  itemName: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#1F2937',
  },
  itemQuantity: {
    fontSize: 11,
    color: '#6B7280',
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 3,
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
    paddingTop: 4,
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
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    gap: 8,
    marginBottom: 16,
  },
  securityText: {
    flex: 1,
    fontSize: 11.5,
    color: '#166534',
    fontWeight: '600',
  },
  actionsContainer: {
    gap: 10,
  },
  confirmButton: {
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
  confirmButtonDisabled: {
    opacity: 0.6,
  },
  confirmButtonText: {
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

