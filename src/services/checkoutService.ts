import { CartTicketItem, OrderPricing, ParkingVehicle } from '../types';

const SERVICE_FEE_RATE = 0.15; // 15% según referencia PASSLP

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const checkoutService = {
  calculatePricing(tickets: CartTicketItem[], parkingVehicles: ParkingVehicle[] = []): OrderPricing {
    const ticketsSubtotal = tickets.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
    const parkingSubtotal = parkingVehicles.reduce((acc, item) => acc + item.price, 0);
    const serviceFeeAmount = Math.round(ticketsSubtotal * SERVICE_FEE_RATE);
    const total = ticketsSubtotal + parkingSubtotal + serviceFeeAmount;

    return {
      ticketsSubtotal,
      parkingSubtotal,
      serviceFeePercentage: 15,
      serviceFeeAmount,
      total,
    };
  },

  formatCurrency(amount: number): string {
    const formatted = new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    }).format(amount);

    // Adapta "$ 10.000" al estilo visual visto en la referencia
    return formatted.replace('ARS', '$').trim();
  },

  async simulatePayment(orderId: string): Promise<{ success: boolean; transactionId: string }> {
    await wait(1200);
    return {
      success: true,
      transactionId: `TX-MOCK-${Date.now()}-${orderId.slice(-4).toUpperCase()}`,
    };
  },
};
