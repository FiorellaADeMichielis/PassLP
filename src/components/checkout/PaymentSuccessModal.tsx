import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Palette } from '@/constants/theme';
import { ShieldCheckIcon } from '../ui/Icons';
import { checkoutService } from '@/services/checkoutService';
import { Order } from '@/types';

interface PaymentSuccessModalProps {
  visible: boolean;
  order: Order | null;
  onClose: () => void;
}

/**
 * Modal de confirmación de pago (S4 - Opción A).
 *
 * Al ocurrir el pago en una plataforma de terceros externa, la app no replica
 * pantallas de pasarela, selector de métodos, estados "procesando", rechazos ni reintentos.
 * Muestra directamente el modal con el texto reglamentario exacto: "Pago realizado con éxito".
 * Al cerrarse, limpia el carrito, detiene el temporizador y retorna a la cartelera de Inicio.
 */
export function PaymentSuccessModal({
  visible,
  order,
  onClose,
}: PaymentSuccessModalProps) {
  if (!order) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Icono de verificación de pago seguro */}
          <View style={styles.iconCircle}>
            <ShieldCheckIcon size={40} color="#FFFFFF" strokeWidth={2.6} />
          </View>

          {/* Texto exacto requerido */}
          <Text style={styles.title}>Pago realizado con éxito</Text>
          <Text style={styles.subtitle}>
            Tu compra se completó correctamente en la plataforma externa.
          </Text>

          {/* Resumen del comprobante */}
          <View style={styles.receiptBox}>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Número de orden:</Text>
              <Text style={styles.receiptValue}>{order.id}</Text>
            </View>

            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Evento:</Text>
              <Text style={styles.receiptValue} numberOfLines={1}>
                {order.eventTitle}
              </Text>
            </View>

            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Total abonado:</Text>
              <Text style={styles.receiptTotal}>
                {checkoutService.formatCurrency(order.pricing.total)}
              </Text>
            </View>

            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Enviado a:</Text>
              <Text style={styles.receiptEmail} numberOfLines={1}>
                {order.buyer.email}
              </Text>
            </View>
          </View>

          {/* Botón de acción para volver al inicio */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Volver al inicio"
          >
            <Text style={styles.closeButtonText}>VOLVER AL INICIO</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    width: '100%',
    maxWidth: 380,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 10,
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#1B9F00',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: Palette.stepCurrent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 12.5,
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 17,
    marginBottom: 16,
  },
  receiptBox: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
    marginBottom: 20,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  receiptLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  receiptValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
    maxWidth: '65%',
  },
  receiptTotal: {
    fontSize: 13.5,
    fontWeight: '900',
    color: '#111827',
  },
  receiptEmail: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E293B',
    maxWidth: '65%',
  },
  closeButton: {
    backgroundColor: Palette.primary,
    width: '100%',
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Palette.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  closeButtonText: {
    color: '#060606',
    fontSize: 13.5,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
});

