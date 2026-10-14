import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';

import { TicketsIcon } from '@/components/ui/Icons';
import { useAppTheme } from '@/hooks/useAppTheme';

/**
 * Pantalla de Mis Tickets.
 *
 * Muestra las entradas adquiridas por el usuario o un estado vacío amigable
 * con acción de retorno a la cartelera.
 */
export default function TicketsScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.headerBg }]}
      edges={['top']}
    >
      <StatusBar style={colors.statusBarStyle} />

      {/* Cabecera superior institucional */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.headerBg,
            borderBottomColor: colors.headerBorder,
          },
        ]}
      >
        <Text
          style={[styles.headerTitle, { color: '#FFFFFF' }]}
          maxFontSizeMultiplier={1.3}
          accessibilityRole="header"
        >
          Mis Tickets
        </Text>
      </View>

      <ScrollView
        style={[styles.container, { backgroundColor: colors.screenBg }]}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Tarjeta de estado vacío */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.cardBg,
              borderColor: colors.cardBorder,
            },
          ]}
        >
          <View style={styles.iconContainer}>
            <TicketsIcon size={44} color={colors.footerActive} />
          </View>

          <Text
            style={[styles.cardTitle, { color: colors.textPrimary }]}
            maxFontSizeMultiplier={1.3}
          >
            No tenés tickets activos
          </Text>

          <Text
            style={[styles.cardDescription, { color: colors.textSecondary }]}
            maxFontSizeMultiplier={1.3}
            selectable
          >
            Cuando confirmes la compra de tus entradas para cualquier evento, tus
            accesos digitales y códigos QR aparecerán en esta sección.
          </Text>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push('/')}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Explorar cartelera de eventos"
          >
            <Text style={styles.primaryButtonText} maxFontSizeMultiplier={1.3}>
              Explorar eventos
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    height: 52,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingTop: 32,
    paddingBottom: 32,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 28,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#332F2B',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  primaryButton: {
    backgroundColor: '#F77F00',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
