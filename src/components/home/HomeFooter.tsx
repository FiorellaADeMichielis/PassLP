import { StyleSheet, Text, View } from 'react-native';

import { Spacing } from '@/constants/theme';

// ─── Colores de diseño (según PASSLP_REFERENCIA.md §2.4 Footer) ──────────────
const FOOTER_BG = '#332F2B';
const FOOTER_TEXT = '#CCCCCC';
const FOOTER_TEXT_MUTED = '#888888';
const LOGO_TEXT_COLOR = '#FFFFFF';

// ─── Componente ───────────────────────────────────────────────────────────────

/**
 * Pie de página de la pantalla principal.
 *
 * Muestra el logotipo, un mensaje de soporte, aviso de copyright
 * y enlaces institucionales, sobre fondo `#332F2B` según referencia PASSLP.
 */
export function HomeFooter() {
  return (
    <View style={styles.container}>
      {/* Logotipo */}
      <Text style={styles.logo}>PassLP</Text>

      {/* Mensaje de soporte */}
      <Text style={styles.supportText}>
        Contactate con soporte en caso de que no te lleguen tus entradas
      </Text>

      {/* Separador */}
      <View style={styles.divider} />

      {/* Links institucionales */}
      <View style={styles.linksRow}>
        <Text style={styles.link}>Eventos Destacados</Text>
        <Text style={styles.separator}>·</Text>
        <Text style={styles.link}>Términos y Condiciones</Text>
        <Text style={styles.separator}>·</Text>
        <Text style={styles.link}>Defensa al Consumidor</Text>
      </View>

      {/* Copyright */}
      <Text style={styles.copyright}>© {new Date().getFullYear()} PassLP — Todos los derechos reservados</Text>
    </View>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    backgroundColor: FOOTER_BG,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.five,
    alignItems: 'center',
    gap: Spacing.two,
  },
  logo: {
    color: LOGO_TEXT_COLOR,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: Spacing.one,
  },
  supportText: {
    color: FOOTER_TEXT,
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
    textDecorationLine: 'underline',
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: '#4A4540',
    marginVertical: Spacing.two,
  },
  linksRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
  },
  link: {
    color: FOOTER_TEXT,
    fontSize: 11,
    textDecorationLine: 'underline',
  },
  separator: {
    color: FOOTER_TEXT_MUTED,
    fontSize: 11,
  },
  copyright: {
    color: FOOTER_TEXT_MUTED,
    fontSize: 10,
    textAlign: 'center',
    marginTop: Spacing.one,
  },
});

