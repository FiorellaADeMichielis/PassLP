import { useColorScheme } from 'react-native';

export type StatusBarStyle = 'light' | 'dark';

export interface AppThemeColors {
  screenBg: string;
  cardBg: string;
  cardBorder: string;
  headerBg: string;
  headerBorder: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  searchBg: string;
  searchPlaceholder: string;
  searchInput: string;
  searchIcon: string;
  btnIngresarBg: string;
  btnIngresarText: string;
  chipBg: string;
  chipBorder: string;
  chipText: string;
  chipSelectedBg: string;
  chipSelectedText: string;
  footerBg: string;
  footerBorder: string;
  footerInactive: string;
  footerActive: string;
  inputBg: string;
  inputBorder: string;
  inputBorderActive: string;
  inputBorderError: string;
  inputText: string;
  inputPlaceholder: string;
  sectionBg: string;
  bottomBarBg: string;
  statusBarStyle: StatusBarStyle;
}

export const LIGHT_THEME: AppThemeColors = {
  screenBg: '#F5F5F5',
  cardBg: '#FFFFFF',
  cardBorder: '#EAEAEA',
  headerBg: '#332F2B',
  headerBorder: '#47423D',
  textPrimary: '#1A1A1A',
  textSecondary: '#666666',
  textMuted: '#999999',
  searchBg: '#FFFFFF',
  searchPlaceholder: '#999999',
  searchInput: '#1A1A1A',
  searchIcon: '#332F2B',
  btnIngresarBg: '#000000',
  btnIngresarText: '#FFFFFF',
  chipBg: '#FFFFFF',
  chipBorder: '#CCCCCC',
  chipText: '#333333',
  chipSelectedBg: '#332F2B',
  chipSelectedText: '#FFFFFF',
  footerBg: '#332F2B',
  footerBorder: '#47423D',
  footerInactive: '#D0CBC5',
  footerActive: '#F77F00',
  inputBg: '#F9F9F9',
  inputBorder: '#CCCCCC',
  inputBorderActive: '#F77F00',
  inputBorderError: '#E63946',
  inputText: '#1A1A1A',
  inputPlaceholder: '#999999',
  sectionBg: '#FFFFFF',
  bottomBarBg: '#332F2B',
  statusBarStyle: 'light',
};

export const DARK_THEME: AppThemeColors = {
  screenBg: '#12100E',
  cardBg: '#1E1A17',
  cardBorder: '#332F2B',
  headerBg: '#1E1A17',
  headerBorder: '#332F2B',
  textPrimary: '#FFFFFF',
  textSecondary: '#A8A39D',
  textMuted: '#7E7A76',
  searchBg: '#2B2623',
  searchPlaceholder: '#8E8A86',
  searchInput: '#FFFFFF',
  searchIcon: '#F77F00',
  btnIngresarBg: '#F77F00',
  btnIngresarText: '#000000',
  chipBg: '#1E1A17',
  chipBorder: '#332F2B',
  chipText: '#D8D3CD',
  chipSelectedBg: '#F77F00',
  chipSelectedText: '#000000',
  footerBg: '#1E1A17',
  footerBorder: '#332F2B',
  footerInactive: '#9E9993',
  footerActive: '#F77F00',
  inputBg: '#2B2623',
  inputBorder: '#3D3732',
  inputBorderActive: '#F77F00',
  inputBorderError: '#E63946',
  inputText: '#FFFFFF',
  inputPlaceholder: '#7E7A76',
  sectionBg: '#1E1A17',
  bottomBarBg: '#1E1A17',
  statusBarStyle: 'light',
};

/**
 * Hook centralizado que provee los colores de la aplicación.
 *
 * Mantiene la interfaz de usuario en el modo claro institucional de PassLP,
 * asegurando que la barra de estado superior (hora, batería, wifi, señal)
 * sea siempre 100% legible con alto contraste tanto en teléfonos configurados
 * con tema claro como con tema oscuro.
 */
export function useAppTheme() {
  const scheme = useColorScheme();
  const systemIsDark = scheme === 'dark';

  return {
    isDark: false,
    systemIsDark,
    colorScheme: 'light' as const,
    colors: LIGHT_THEME,
  };
}
