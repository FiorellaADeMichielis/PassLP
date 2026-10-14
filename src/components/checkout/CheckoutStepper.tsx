import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Palette } from '@/constants/theme';
import { CheckIcon } from '../ui/Icons';

export interface StepItem {
  id: number;
  label: string;
}

interface CheckoutStepperProps {
  steps: StepItem[];
  currentStep: number; // 1-based index
}

/**
 * Indicador visual de pasos horizontales para el Checkout (S3).
 *
 * Colores según PASSLP_REFERENCIA.md §5.1 y §9.1:
 * - Paso actual: Palette.stepCurrent
 * - Paso completado: Palette.stepCompleted
 * - Paso pendiente: Palette.stepPending
 */
export function CheckoutStepper({ steps, currentStep }: CheckoutStepperProps) {
  return (
    <View style={styles.container}>
      <View style={styles.stepsRow}>
        {steps.map((step, index) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;
          const isPending = step.id > currentStep;

          let circleBg: string = Palette.stepPending;
          if (isCurrent) circleBg = Palette.stepCurrent;
          if (isCompleted) circleBg = Palette.stepCompleted;

          return (
            <React.Fragment key={step.id}>
              {/* Línea conectora previa */}
              {index > 0 && (
                <View
                  style={[
                    styles.connectorLine,
                    step.id <= currentStep && styles.connectorLineActive,
                  ]}
                />
              )}

              {/* Círculo del paso y etiqueta */}
              <View style={styles.stepItem}>
                <View style={[styles.circle, { backgroundColor: circleBg }]}>
                  {isCompleted ? (
                    <CheckIcon size={13} color={Palette.white} strokeWidth={3} />
                  ) : (
                    <Text style={styles.circleNumber}>{step.id}</Text>
                  )}
                </View>
                <Text
                  style={[
                    styles.stepLabel,
                    isCurrent && styles.stepLabelCurrent,
                    isPending && styles.stepLabelPending,
                  ]}
                  numberOfLines={2}
                >
                  {step.label}
                </Text>
              </View>
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 14,
    paddingHorizontal: 8,
    backgroundColor: Palette.white,
    borderRadius: 14,
    marginHorizontal: 12,
    marginTop: 10,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  stepsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  stepItem: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 2,
  },
  circle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    shadowColor: Palette.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  circleNumber: {
    color: Palette.white,
    fontSize: 13,
    fontWeight: '800',
  },
  stepLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    color: Palette.textPrimary,
    textAlign: 'center',
    lineHeight: 13,
  },
  stepLabelCurrent: {
    color: Palette.stepCurrent,
    fontWeight: '900',
  },
  stepLabelPending: {
    color: '#8E8E8E',
    fontWeight: '500',
  },
  connectorLine: {
    position: 'relative',
    top: 14,
    height: 2,
    flex: 0.8,
    backgroundColor: '#DCDCDC',
    marginHorizontal: -4,
  },
  connectorLineActive: {
    backgroundColor: Palette.stepCompleted,
  },
});

