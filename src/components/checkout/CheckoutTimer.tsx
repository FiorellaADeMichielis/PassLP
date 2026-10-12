import { useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus, StyleSheet, Text, View } from 'react-native';
import { TimerIcon } from '../ui/Icons';

interface CheckoutTimerProps {
  initialSeconds?: number; // 600s = 10 minutos por defecto
  onExpire: () => void;
}

/**
 * Temporizador de cuenta regresiva en tiempo real para el proceso de compra (S3).
 *
 * Utiliza una marca de tiempo absoluta (target timestamp) y sincronización
 * con AppState para persistir y continuar descontando el tiempo real transcurrido
 * incluso si el usuario suspende la aplicación o la envía a segundo plano.
 * Al agotarse, se dispara el callback `onExpire`.
 */
export function CheckoutTimer({
  initialSeconds = 600,
  onExpire,
}: CheckoutTimerProps) {
  const [targetTime] = useState(() => Date.now() + initialSeconds * 1000);
  const [secondsLeft, setSecondsLeft] = useState<number>(initialSeconds);
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    function updateTime() {
      const remaining = Math.max(
        0,
        Math.ceil((targetTime - Date.now()) / 1000)
      );
      setSecondsLeft(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        onExpireRef.current();
      }
    }

    // Intervalo regular cada segundo
    const interval = setInterval(updateTime, 1000);

    // Sincronización inmediata al volver desde segundo plano
    const subscription = AppState.addEventListener(
      'change',
      (nextAppState: AppStateStatus) => {
        if (nextAppState === 'active') {
          updateTime();
        }
      }
    );

    return () => {
      clearInterval(interval);
      subscription.remove();
    };
  }, [targetTime]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');

  const isLowTime = secondsLeft < 120; // Menos de 2 minutos

  return (
    <View style={[styles.container, isLowTime && styles.containerUrgent]}>
      <TimerIcon
        size={15}
        color={isLowTime ? '#D00000' : '#148083'}
        strokeWidth={2.4}
      />
      <Text style={styles.label}>TEMPORIZADOR:</Text>
      <Text style={[styles.timeText, isLowTime && styles.timeTextUrgent]}>
        {formattedMinutes}:{formattedSeconds} MIN
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EAF7F8',
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 20,
    alignSelf: 'center',
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#C2E7E8',
    gap: 6,
  },
  containerUrgent: {
    backgroundColor: '#FFEBEB',
    borderColor: '#FFC7C7',
  },
  label: {
    fontSize: 11,
    fontWeight: '800',
    color: '#332F2B',
    letterSpacing: 0.5,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#148083',
    letterSpacing: 0.8,
  },
  timeTextUrgent: {
    color: '#D00000',
  },
});

