import React, { useEffect, useMemo, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { AttendeesFormStep } from '@/components/checkout/AttendeesFormStep';
import { BuyerFormStep } from '@/components/checkout/BuyerFormStep';
import { CheckoutStepper, StepItem } from '@/components/checkout/CheckoutStepper';
import { CheckoutTimer } from '@/components/checkout/CheckoutTimer';
import { OrderConfirmationStep } from '@/components/checkout/OrderConfirmationStep';
import { OrderSummaryStep } from '@/components/checkout/OrderSummaryStep';
import { PaymentSuccessModal } from '@/components/checkout/PaymentSuccessModal';
import { EventHero } from '@/components/event/EventHero';
import { Spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/useAppTheme';
import { checkoutService } from '@/services/checkoutService';
import { eventsService } from '@/services/eventsService';
import {
  AttendeeData,
  BuyerData,
  CartTicketItem,
  EventItem,
  Order,
  ParkingVehicle,
} from '@/types';

const INITIAL_BUYER_DATA: BuyerData = {
  firstName: '',
  lastName: '',
  dni: '',
  phone: '',
  province: '',
  email: '',
  confirmEmail: '',
  allTicketsSameName: true,
};

/**
 * Pantalla del Proceso de Compra (Checkout - S3 y S4).
 *
 * Administra el stepper de 3 o 4 pasos, el temporizador de 10 minutos,
 * la persistencia de datos del comprador y asistentes, y la apertura
 * del modal de simulación de pago.
 */
export default function CheckoutScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const { id, tickets: rawTickets, vehicles: rawVehicles } = useLocalSearchParams<{
    id: string;
    tickets?: string;
    vehicles?: string;
  }>();

  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);

  // Parseo de parámetros
  const ticketQuantities: Record<string, number> = useMemo(() => {
    try {
      return rawTickets ? JSON.parse(rawTickets) : {};
    } catch {
      return {};
    }
  }, [rawTickets]);

  const addedVehicles: ParkingVehicle[] = useMemo(() => {
    try {
      return rawVehicles ? JSON.parse(rawVehicles) : [];
    } catch {
      return [];
    }
  }, [rawVehicles]);

  // Carga del evento
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

  // Transformación de tickets comprados
  const cartTickets: CartTicketItem[] = useMemo(() => {
    if (!event) return [];
    return event.ticketTiers
      .filter((tier) => (ticketQuantities[tier.id] || 0) > 0)
      .map((tier) => {
        const qty = ticketQuantities[tier.id];
        return {
          ticketTierId: tier.id,
          name: `${tier.name} (${tier.tierLabel})`,
          tierLabel: tier.tierLabel,
          unitPrice: tier.price,
          quantity: qty,
          subtotal: tier.price * qty,
        };
      });
  }, [event, ticketQuantities]);

  // Pricing
  const pricing = useMemo(() => {
    return checkoutService.calculatePricing(cartTickets, addedVehicles);
  }, [cartTickets, addedVehicles]);

  // Estado del flujo
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [buyerData, setBuyerData] = useState<BuyerData>(INITIAL_BUYER_DATA);
  const [attendeesData, setAttendeesData] = useState<AttendeeData[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);

  // Definición dinámica de pasos del Stepper
  const stepperSteps: StepItem[] = useMemo(() => {
    if (buyerData.allTicketsSameName) {
      return [
        { id: 1, label: 'Revisá tu Orden' },
        { id: 2, label: 'Ingresá tus datos' },
        { id: 3, label: 'Confirmar compra' },
      ];
    }
    return [
      { id: 1, label: 'Revisá tu Orden' },
      { id: 2, label: 'Ingresá tus datos' },
      { id: 3, label: 'Datos de asistentes' },
      { id: 4, label: 'Confirmar compra' },
    ];
  }, [buyerData.allTicketsSameName]);

  // Expiración del temporizador
  function handleTimerExpired() {
    Alert.alert(
      'Tiempo expirado',
      'El tiempo para completar tu compra ha finalizado. La reserva de tus entradas fue liberada.',
      [
        {
          text: 'Aceptar',
          onPress: () => router.replace('/'),
        },
      ]
    );
  }

  // Navegación entre pasos
  function handleNextFromSummary() {
    setCurrentStep(2);
  }

  function handleBackFromSummary() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace(event ? `/event/${event.id}` : '/');
    }
  }

  function handleBuyerSubmit(data: BuyerData) {
    setBuyerData(data);
    if (data.allTicketsSameName) {
      // Salta directo al paso de confirmación
      setCurrentStep(3);
    } else {
      // Va al paso de asistentes
      setCurrentStep(3);
    }
  }

  function handleBackFromBuyer() {
    setCurrentStep(1);
  }

  function handleAttendeesSubmit(attendees: AttendeeData[]) {
    setAttendeesData(attendees);
    // Avanza al paso 4 (Confirmación con asistentes)
    setCurrentStep(4);
  }

  function handleBackFromAttendees() {
    setCurrentStep(2);
  }

  function handleBackFromConfirmation() {
    if (buyerData.allTicketsSameName) {
      setCurrentStep(2);
    } else {
      setCurrentStep(3);
    }
  }

  function handleConfirmOrder() {
    if (!event) return;

    const orderId = `ORD-${Date.now().toString().slice(-6)}`;
    const newOrder: Order = {
      id: orderId,
      eventId: event.id,
      eventTitle: event.title,
      eventDate: `${event.date} • ${event.time}`,
      tickets: cartTickets,
      parkingVehicles: addedVehicles,
      pricing,
      buyer: buyerData,
      attendees: buyerData.allTicketsSameName ? [] : attendeesData,
      status: 'completed',
      createdAt: new Date().toISOString(),
    };

    setCurrentOrder(newOrder);
    setIsPaymentModalVisible(true);
  }

  function handleClosePaymentModal() {
    setIsPaymentModalVisible(false);
    router.replace('/');
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#F77F00" />
        <Text style={styles.loadingText}>Cargando proceso de compra...</Text>
      </SafeAreaView>
    );
  }

  if (!event || cartTickets.length === 0) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Text style={styles.errorTitle}>Carrito no encontrado o vacío</Text>
        <Text style={styles.errorSubtitle}>
          Por favor, selecciona tus entradas desde el detalle del evento.
        </Text>
        <TouchableOpacity style={styles.backHomeBtn} onPress={() => router.replace('/')}>
          <Text style={styles.backHomeBtnText}>Volver a la cartelera</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Identificador del paso de confirmación según si hay paso de asistentes
  const isConfirmationStep = buyerData.allTicketsSameName
    ? currentStep === 3
    : currentStep === 4;

  const isAttendeesStep = !buyerData.allTicketsSameName && currentStep === 3;
  const [bgStart] = event?.heroBgColors || ['#1E1A18', '#100D0B'];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: bgStart }]} edges={['top']}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={[styles.scroll, { backgroundColor: colors.screenBg }]}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Hero superior que persiste según especificación */}
          <EventHero event={event} />

          {/* Stepper horizontal de avance */}
          <CheckoutStepper steps={stepperSteps} currentStep={currentStep} />

          {/* Temporizador de compra */}
          <CheckoutTimer initialSeconds={600} onExpire={handleTimerExpired} />

          {/* PASO 1: Revisá tu Orden */}
          {currentStep === 1 && (
            <OrderSummaryStep
              event={event}
              tickets={cartTickets}
              parkingVehicles={addedVehicles}
              pricing={pricing}
              onNext={handleNextFromSummary}
              onBack={handleBackFromSummary}
            />
          )}

          {/* PASO 2: Ingresá tus datos */}
          {currentStep === 2 && (
            <BuyerFormStep
              initialData={buyerData}
              onSubmit={handleBuyerSubmit}
              onBack={handleBackFromBuyer}
            />
          )}

          {/* PASO 3: Datos de asistentes (Condicional) */}
          {isAttendeesStep && (
            <AttendeesFormStep
              tickets={cartTickets}
              initialAttendees={attendeesData}
              onSubmit={handleAttendeesSubmit}
              onBack={handleBackFromAttendees}
            />
          )}

          {/* PASO FINAL: Confirmar compra */}
          {isConfirmationStep && (
            <OrderConfirmationStep
              event={event}
              tickets={cartTickets}
              parkingVehicles={addedVehicles}
              pricing={pricing}
              buyer={buyerData}
              attendees={attendeesData}
              onConfirm={handleConfirmOrder}
              onBack={handleBackFromConfirmation}
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* S4: Modal de Confirmación de Pago */}
      <PaymentSuccessModal
        visible={isPaymentModalVisible}
        order={currentOrder}
        onClose={handleClosePaymentModal}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#D9D9D9',
  },
  keyboardContainer: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.four,
    backgroundColor: '#D9D9D9',
    gap: Spacing.two,
  },
  loadingText: {
    fontSize: 14,
    color: '#666666',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  errorSubtitle: {
    fontSize: 13,
    color: '#666666',
    textAlign: 'center',
    maxWidth: 280,
  },
  backHomeBtn: {
    marginTop: Spacing.two,
    backgroundColor: '#332F2B',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    borderRadius: 8,
  },
  backHomeBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
});

