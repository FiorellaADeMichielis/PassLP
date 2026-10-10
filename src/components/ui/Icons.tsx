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

