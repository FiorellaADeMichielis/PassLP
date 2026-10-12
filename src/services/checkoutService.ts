import { CartTicketItem, OrderPricing, ParkingVehicle } from '../types';
import { formatCurrency } from '../utils/formatters';

const SERVICE_FEE_RATE = 0.15; // 15% según referencia PASSLP

export const checkoutService = {
  calculatePricing(tickets: CartTicketItem[], parkingVehicles: ParkingVehicle[] = []): OrderPricing {
    const ticketsSubtotal = tickets.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
    const parkingSubtotal = parkingVehicles.reduce((acc, item) => acc + item.price, 0);
    const serviceFeeAmount = Math.round((ticketsSubtotal + parkingSubtotal) * SERVICE_FEE_RATE);
    const total = ticketsSubtotal + parkingSubtotal + serviceFeeAmount;

    return {
      ticketsSubtotal,
      parkingSubtotal,
      serviceFeePercentage: 15,
      serviceFeeAmount,
      total,
    };
  },

  formatCurrency,
};
