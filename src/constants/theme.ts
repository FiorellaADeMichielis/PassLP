/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#000000',
    background: '#ffffff',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    textSecondary: '#60646C',
  },
  dark: {
    text: '#ffffff',
    background: '#000000',
    backgroundElement: '#212225',
    backgroundSelected: '#2E3135',
    textSecondary: '#B0B4BA',
  },
} as const;

export const Palette = {
  primary: '#F77F00',
  primaryDark: '#C84200',
  primaryHover: '#E85D04',
  secondary: '#54C1C3',
  charcoal: '#332F2B',
  charcoalBorder: '#47423D',
  charcoalDark: '#1E1A17',
  danger: '#E63946',
  success: '#2A9D8F',
  stepCurrent: '#1B9F00',
  stepCompleted: '#41AA2B',
  stepPending: '#BCBCBC',
  background: '#F5F5F5',
  cardBg: '#FFFFFF',
  cardBorder: '#EAEAEA',
  textPrimary: '#1A1A1A',
  textSecondary: '#666666',
  textMuted: '#595959',
  tealDark: '#148083',
  tealLight: '#EAF7F8',
  tealBorder: '#C2E7E8',
  dangerDark: '#D00000',
  dangerLight: '#FFEBEB',
  dangerBorder: '#FFC7C7',
  border: '#CCCCCC',
  borderInput: '#D8D3CD',
  white: '#FFFFFF',
  black: '#000000',
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
