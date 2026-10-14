import { useRef } from 'react';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AccountIcon, ChevronLeftIcon, TicketsIcon } from '@/components/ui/Icons';
import { Spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/useAppTheme';

/**
 * Pantalla de Mi Cuenta / Iniciar Sesión.
 *
 * Accesible desde el botón "Ingresar" de la cabecera y desde la pestaña
 * "Cuenta" de la barra de navegación inferior nativa.
 */
export default function AccountScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const isNavigatingRef = useRef(false);

  function handleBack() {
    if (isNavigatingRef.current) return;
    isNavigatingRef.current = true;
    setTimeout(() => {
      isNavigatingRef.current = false;
    }, 500);

    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  }

  function handleLoginPress() {
    Alert.alert(
      'Iniciar Sesión',
      'El sistema de autenticación de usuarios estará disponible próximamente.'
    );
  }

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
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          accessibilityRole="button"
          accessibilityLabel="Volver a la pantalla anterior"
        >
          <ChevronLeftIcon size={20} color="#FFFFFF" />
          <Text style={styles.backButtonText} maxFontSizeMultiplier={1.3}>
            Volver
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleBack}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Ir al inicio de PassLP"
        >
          <Image
            source={require('@/assets/logo-on-dark.png')}
            style={styles.logoImage}
            contentFit="contain"
            accessibilityLabel="Logotipo PassLP"
          />
        </TouchableOpacity>

        {/* Espaciador para equilibrar el botón volver y centrar el logo */}
        <View style={styles.headerSpacer} />
      </View>

      {/* Contenido principal centrado sobre fondo de pantalla adaptativo */}
      <View style={[styles.content, { backgroundColor: colors.screenBg }]}>
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.cardBg,
              borderColor: colors.cardBorder,
            },
          ]}
        >
          {/* Badge circular con icono de tickets */}
          <View
            style={[
              styles.iconCircle,
              {
                backgroundColor:
                  colors.screenBg === '#12100E' ? '#2B231D' : '#FFF2E6',
              },
            ]}
          >
            <TicketsIcon size={36} color="#F77F00" />
          </View>

          {/* Subtítulo institucional */}
          <Text
            style={styles.badgeLabel}
            maxFontSizeMultiplier={1.3}
          >
            Mi Cuenta
          </Text>

          {/* Mensaje principal */}
          <Text
            style={[styles.mainMessage, { color: colors.textPrimary }]}
            maxFontSizeMultiplier={1.3}
          >
            Iniciar sesión para acceder a tus tickets
          </Text>

          {/* Descripción secundaria */}
          <Text
            style={[styles.description, { color: colors.textSecondary }]}
            maxFontSizeMultiplier={1.3}
            selectable
          >
            Gestioná tus entradas adquiridas, consultá tus comprobantes de compra y administrá tus datos desde un solo lugar.
          </Text>

          {/* Botón principal de Iniciar Sesión */}
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleLoginPress}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Iniciar sesión con tu cuenta"
          >
            <AccountIcon size={18} color="#332F2B" style={styles.buttonIcon} />
            <Text style={styles.primaryButtonText} maxFontSizeMultiplier={1.3}>
              Iniciar sesión
            </Text>
          </TouchableOpacity>

          {/* Enlace secundario: Volver a la cartelera */}
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleBack}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Volver a la cartelera de eventos"
          >
            <Text
              style={[styles.secondaryButtonText, { color: colors.textSecondary }]}
              maxFontSizeMultiplier={1.3}
            >
              Explorar eventos
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two + 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    minWidth: 70,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  logoImage: {
    width: 84,
    height: 28,
  },
  headerSpacer: {
    minWidth: 70,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.four,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    borderRadius: 16,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.five,
    alignItems: 'center',
    borderWidth: 1,
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  iconCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#FFF2E6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.three,
  },
  badgeLabel: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.one,
    color: '#F77F00',
  },
  mainMessage: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: Spacing.two,
    lineHeight: 24,
  },
  description: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: Spacing.four,
    paddingHorizontal: Spacing.two,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#54C1C3',
    borderRadius: 999,
    paddingVertical: Spacing.two + 4,
    paddingHorizontal: Spacing.five,
    width: '100%',
    marginBottom: Spacing.two,
  },
  buttonIcon: {
    marginRight: Spacing.one + 2,
  },
  primaryButtonText: {
    color: '#332F2B',
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryButton: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
  secondaryButtonText: {
    fontSize: 13,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
});

