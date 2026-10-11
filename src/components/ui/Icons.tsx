import Svg, {
  Circle,
  Line,
  Path,
  Polygon,
  Polyline,
  Rect,
  SvgProps,
} from 'react-native-svg';

interface IconProps extends SvgProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

/** Icono de lupa para el buscador. */
export function SearchIcon({
  size = 16,
  color = '#332F2B',
  strokeWidth = 2.4,
  ...props
}: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <Circle cx="11" cy="11" r="7.5" />
      <Line x1="21" y1="21" x2="16.5" y2="16.5" />
    </Svg>
  );
}

/** Icono de pin de ubicación para tarjetas y detalle. */
export function PinIcon({
  size = 14,
  color = '#E85D04',
  strokeWidth = 2.4,
  ...props
}: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <Circle cx="12" cy="10" r="3" />
    </Svg>
  );
}

/** Icono de casa para pestaña Inicio. */
export function HomeIcon({
  size = 22,
  color = '#F77F00',
  strokeWidth = 2.2,
  ...props
}: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <Polyline points="9 22 9 12 15 12 15 22" />
    </Svg>
  );
}

/** Icono de brújula para pestaña Explorar. */
export function ExploreIcon({
  size = 22,
  color = '#D0CBC5',
  strokeWidth = 2.2,
  ...props
}: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <Circle cx="12" cy="12" r="10" />
      <Polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </Svg>
  );
}

/** Icono de entrada/ticket para pestaña Tickets. */
export function TicketsIcon({
  size = 22,
  color = '#D0CBC5',
  strokeWidth = 2.2,
  ...props
}: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <Rect x="2" y="6" width="20" height="12" rx="2" />
      <Circle cx="2" cy="12" r="2" fill="#332F2B" />
      <Circle cx="22" cy="12" r="2" fill="#332F2B" />
      <Line x1="12" y1="6" x2="12" y2="18" strokeDasharray="2, 2" />
    </Svg>
  );
}

/** Icono de usuario para pestaña Cuenta. */
export function AccountIcon({
  size = 22,
  color = '#D0CBC5',
  strokeWidth = 2.2,
  ...props
}: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <Circle cx="12" cy="7" r="4" />
    </Svg>
  );
}

/** Icono de flecha atrás / volver. */
export function ChevronLeftIcon({
  size = 20,
  color = '#FFFFFF',
  strokeWidth = 2.4,
  ...props
}: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <Polyline points="15 18 9 12 15 6" />
    </Svg>
  );
}

/** Icono de calendario para fecha. */
export function CalendarIcon({
  size = 14,
  color = '#FFFFFF',
  strokeWidth = 2.2,
  ...props
}: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <Rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <Line x1="16" y1="2" x2="16" y2="6" />
      <Line x1="8" y1="2" x2="8" y2="6" />
      <Line x1="3" y1="10" x2="21" y2="10" />
    </Svg>
  );
}

/** Icono de reloj para hora del evento. */
export function ClockIcon({
  size = 14,
  color = '#FFFFFF',
  strokeWidth = 2.2,
  ...props
}: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <Circle cx="12" cy="12" r="10" />
      <Polyline points="12 6 12 12 16 14" />
    </Svg>
  );
}

/** Icono circular "E" de estacionamiento. */
export function ParkingBadgeIcon({
  size = 18,
  color = '#0D4F9C',
  ...props
}: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <Circle cx="12" cy="12" r="11" fill={color} />
      <Path
        d="M9 7h4a3 3 0 0 1 0 6H9V7zm0 6h4"
        stroke="#FFFFFF"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Line x1="9" y1="7" x2="9" y2="17" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" />
    </Svg>
  );
}

/** Icono de papelera para eliminar vehículos del estacionamiento. */
export function TrashIcon({
  size = 16,
  color = '#E63946',
  strokeWidth = 2,
  ...props
}: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <Polyline points="3 6 5 6 21 6" />
      <Path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </Svg>
  );
}

/** Icono de signo menos para selector numérico. */
export function MinusIcon({
  size = 12,
  color = '#FFFFFF',
  strokeWidth = 2.6,
  ...props
}: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <Line x1="5" y1="12" x2="19" y2="12" />
    </Svg>
  );
}

/** Icono de signo más para selector numérico. */
export function PlusIcon({
  size = 12,
  color = '#FFFFFF',
  strokeWidth = 2.6,
  ...props
}: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <Line x1="12" y1="5" x2="12" y2="19" />
      <Line x1="5" y1="12" x2="19" y2="12" />
    </Svg>
  );
}

/** Icono de tilde de verificación (Checkmark). */
export function CheckIcon({
  size = 14,
  color = '#FFFFFF',
  strokeWidth = 2.6,
  ...props
}: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <Polyline points="20 6 9 17 4 12" />
    </Svg>
  );
}

/** Icono de cronómetro / temporizador. */
export function TimerIcon({
  size = 14,
  color = '#54C1C3',
  strokeWidth = 2.2,
  ...props
}: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <Circle cx="12" cy="13" r="8" />
      <Line x1="12" y1="9" x2="12" y2="13" />
      <Line x1="12" y1="13" x2="15" y2="15" />
      <Line x1="10" y1="2" x2="14" y2="2" />
    </Svg>
  );
}

/** Icono de advertencia circular. */
export function AlertCircleIcon({
  size = 16,
  color = '#E63946',
  strokeWidth = 2.2,
  ...props
}: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <Circle cx="12" cy="12" r="10" />
      <Line x1="12" y1="8" x2="12" y2="12" />
      <Line x1="12" y1="16" x2="12.01" y2="16" />
    </Svg>
  );
}

/** Icono de tarjeta de crédito para simulación de pago. */
export function CreditCardIcon({
  size = 18,
  color = '#332F2B',
  strokeWidth = 2.2,
  ...props
}: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <Rect x="2" y="5" width="20" height="14" rx="2" />
      <Line x1="2" y1="10" x2="22" y2="10" />
    </Svg>
  );
}

/** Icono de escudo de seguridad para pago seguro. */
export function ShieldCheckIcon({
  size = 18,
  color = '#1B9F00',
  strokeWidth = 2.2,
  ...props
}: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <Polyline points="9 12 11 14 15 10" />
    </Svg>
  );
}


