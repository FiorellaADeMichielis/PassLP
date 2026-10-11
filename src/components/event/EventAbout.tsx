import { StyleSheet, Text, View } from 'react-native';

import { Spacing } from '@/constants/theme';

interface EventAboutProps {
  /** Texto descriptivo o reglas sobre el evento. */
  about: string;
}

/**
 * Sección "SOBRE EL EVENTO" según especificación PASSLP §3.5.
 *
 * Muestra información adicional, dresscode, restricciones de edad o detalles
 * organizativos del evento.
 */
export function EventAbout({ about }: EventAboutProps) {
  if (!about) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SOBRE EL EVENTO</Text>
      <View style={styles.divider} />
      <Text style={styles.content}>{about}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: Spacing.three,
    marginVertical: Spacing.two,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    gap: Spacing.two,
  },
  title: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1A1A1A',
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
  },
  content: {
    fontSize: 13,
    color: '#444444',
    lineHeight: 20,
  },
});

