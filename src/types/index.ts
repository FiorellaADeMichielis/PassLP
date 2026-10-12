export type EventCategory =
  | 'Todas'
  | 'Actividades'
  | 'Bares'
  | 'Cenas'
  | 'Cine'
  | 'Discotecas'
  | 'Eventos deportivos'
  | 'Fiestas'
  | 'Recepciones'
  | 'Recitales'
  | 'Sessions'
  | 'Teatro';

export type VehicleType = 'Sedán' | 'Pickup';

export interface Venue {
  name: string;
  address: string;
  city: string;
  province: string;
}

export interface TicketTier {
  id: string;
  tierLabel: string; // ej. "Lote 1", "Tanda 1"
  name: string;
  type: string; // ej. "Normal", "VIP", "Acceso General"
  description: string;
  price: number;
  availableQuantity: number;
  maxPerPurchase: number;
}

export interface ParkingOption {
  id: string;
  vehicleType: VehicleType;
  price: number;
}

export interface ParkingVehicle {
  id: string;
  vehicleType: VehicleType;
  plate: string;
  model: string;
  price: number;
}

export interface EventItem {
  id: string;
  title: string;
  category: EventCategory;
  date: string; // "Sábado, 31 De Octubre De 2026"
  dateShort: string; // "31/10/2026"
  time: string; // "21:00 hs"
  venue: Venue;
  flyerUrl: string | number;
  heroBgColors: [string, string];
  about: string;
  isFeatured: boolean;
  hasParking: boolean;
  parkingOptions?: ParkingOption[];
  ticketTiers: TicketTier[];
}

export interface CartTicketItem {
  ticketTierId: string;
  name: string;
  tierLabel: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface BuyerData {
  firstName: string;
  lastName: string;
  dni: string;
  phone: string;
  province: string;
  email: string;
  confirmEmail: string;
  allTicketsSameName: boolean;
}

export interface AttendeeData {
  id: string;
  ticketTierId: string;
  ticketName: string;
  attendeeNumber: number;
  firstName: string;
  lastName: string;
  dni: string;
}

export interface OrderPricing {
  ticketsSubtotal: number;
  parkingSubtotal: number;
  serviceFeePercentage: number;
  serviceFeeAmount: number;
  total: number;
}

export type OrderStatus = 'pending' | 'completed' | 'expired' | 'failed';

export interface Order {
  id: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  tickets: CartTicketItem[];
  parkingVehicles: ParkingVehicle[];
  pricing: OrderPricing;
  buyer: BuyerData;
  attendees: AttendeeData[];
  status: OrderStatus;
  createdAt: string;
}

