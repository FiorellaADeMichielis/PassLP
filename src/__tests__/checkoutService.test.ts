import { checkoutService } from '../services/checkoutService';
import { CartTicketItem, ParkingVehicle } from '../types';

describe('checkoutService', () => {
  describe('calculatePricing', () => {
    it('calcula correctamente el subtotal de entradas sin estacionamiento', () => {
      const tickets: CartTicketItem[] = [
        {
          ticketTierId: 't1',
          name: 'General',
          tierLabel: 'Lote 1',
          unitPrice: 10000,
          quantity: 2,
          subtotal: 20000,
        },
      ];

      const pricing = checkoutService.calculatePricing(tickets);

      expect(pricing.ticketsSubtotal).toBe(20000);
      expect(pricing.parkingSubtotal).toBe(0);
      expect(pricing.serviceFeePercentage).toBe(15);
      expect(pricing.serviceFeeAmount).toBe(3000); // 15% de 20.000
      expect(pricing.total).toBe(23000);
    });

    it('calcula correctamente el subtotal combinando múltiples tandas y vehículos de estacionamiento', () => {
      const tickets: CartTicketItem[] = [
        { ticketTierId: 't1', name: 'Campo', tierLabel: 'Lote 1', unitPrice: 15000, quantity: 2, subtotal: 30000 },
        { ticketTierId: 't2', name: 'VIP', tierLabel: 'Lote 1', unitPrice: 30000, quantity: 1, subtotal: 30000 },
      ];
      const parkingVehicles: ParkingVehicle[] = [
        { id: 'p1', vehicleType: 'Sedán', plate: 'AA123BB', model: 'Cronos', price: 5000 },
        { id: 'p2', vehicleType: 'Pickup', plate: 'A123BCD', model: 'Hilux', price: 3000 },
      ];

      const pricing = checkoutService.calculatePricing(tickets, parkingVehicles);

      // Entradas: (15000 * 2) + 30000 = 60000
      expect(pricing.ticketsSubtotal).toBe(60000);
      // Estacionamiento: 5000 + 3000 = 8000
      expect(pricing.parkingSubtotal).toBe(8000);
      // Subtotal base: 68000. Comisión 15%: 10200
      expect(pricing.serviceFeeAmount).toBe(10200);
      // Total: 68000 + 10200 = 78200
      expect(pricing.total).toBe(78200);
    });

    it('redondea la comisión de servicio de 15% al entero más cercano ante montos impares', () => {
      const tickets: CartTicketItem[] = [
        { ticketTierId: 't1', name: 'Early Bird', tierLabel: 'Tanda 1', unitPrice: 1233, quantity: 1, subtotal: 1233 },
      ];

      const pricing = checkoutService.calculatePricing(tickets);

      // 1233 * 0.15 = 184.95 -> Math.round -> 185
      expect(pricing.ticketsSubtotal).toBe(1233);
      expect(pricing.serviceFeeAmount).toBe(185);
      expect(pricing.total).toBe(1418);
    });

    it('retorna ceros si el carrito no tiene ítems ni vehículos', () => {
      const pricing = checkoutService.calculatePricing([], []);

      expect(pricing.ticketsSubtotal).toBe(0);
      expect(pricing.parkingSubtotal).toBe(0);
      expect(pricing.serviceFeePercentage).toBe(15);
      expect(pricing.serviceFeeAmount).toBe(0);
      expect(pricing.total).toBe(0);
    });
  });

  describe('formatCurrency', () => {
    it('formatea montos delegando a la función de formateo institucional', () => {
      const formatted = checkoutService.formatCurrency(25000);
      expect(formatted).toContain('25.000');
      expect(formatted).toContain('$');
    });
  });
});

