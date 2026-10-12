import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { cleanName, formatDNI } from './BuyerFormStep';
import { AttendeeData, CartTicketItem } from '@/types';

interface AttendeesFormStepProps {
  tickets: CartTicketItem[];
  initialAttendees: AttendeeData[];
  onSubmit: (attendees: AttendeeData[]) => void;
  onBack: () => void;
}

/**
 * Paso 3 del Checkout (Condicional): Datos de cada asistente (S3.3).
 *
 * Se activa si en el paso 2 se seleccionó que las entradas NO están al mismo nombre.
 * Renderiza una tarjeta por cada entrada individual comprada con validaciones estrictas
 * (nombres sin números/símbolos y DNI numérico formateado de 8 dígitos).
 */
export function AttendeesFormStep({
  tickets,
  initialAttendees,
  onSubmit,
  onBack,
}: AttendeesFormStepProps) {
  // Inicializa o reutiliza los asistentes
  const [attendees, setAttendees] = useState<AttendeeData[]>(() => {
    if (initialAttendees.length > 0) return initialAttendees;

    const list: AttendeeData[] = [];
    let counter = 1;

    tickets.forEach((ticket) => {
      for (let i = 0; i < ticket.quantity; i++) {
        list.push({
          id: `att-${ticket.ticketTierId}-${counter}`,
          ticketTierId: ticket.ticketTierId,
          ticketName: ticket.name,
          attendeeNumber: counter,
          firstName: '',
          lastName: '',
          dni: '',
        });
        counter++;
      }
    });

    return list;
  });

  const [errors, setErrors] = useState<Record<string, Record<string, string>>>({});

  function handleFieldChange(
    attendeeId: string,
    field: 'firstName' | 'lastName' | 'dni',
    value: string
  ) {
    let processedValue = value;
    if (field === 'firstName' || field === 'lastName') {
      processedValue = cleanName(value);
    } else if (field === 'dni') {
      processedValue = formatDNI(value);
    }

    setAttendees((prev) =>
      prev.map((att) => (att.id === attendeeId ? { ...att, [field]: processedValue } : att))
    );

    if (errors[attendeeId]?.[field]) {
      setErrors((prev) => ({
        ...prev,
        [attendeeId]: {
          ...prev[attendeeId],
          [field]: '',
        },
      }));
    }
  }

  function validate(): boolean {
    const newErrors: Record<string, Record<string, string>> = {};
    let hasError = false;

    attendees.forEach((att) => {
      const attErrors: Record<string, string> = {};
      const cleanFirst = att.firstName.trim();
      if (!cleanFirst) {
        attErrors.firstName = 'Ingresá el nombre';
        hasError = true;
      } else if (cleanFirst.length < 2) {
        attErrors.firstName = 'Mínimo 2 letras';
        hasError = true;
      }

      const cleanLast = att.lastName.trim();
      if (!cleanLast) {
        attErrors.lastName = 'Ingresá el apellido';
        hasError = true;
      } else if (cleanLast.length < 2) {
        attErrors.lastName = 'Mínimo 2 letras';
        hasError = true;
      }

      const dniDigits = att.dni.replace(/\D/g, '');
      if (!dniDigits) {
        attErrors.dni = 'Ingresá el DNI';
        hasError = true;
      } else if (dniDigits.length !== 8) {
        attErrors.dni = 'Debe tener exactamente 8 dígitos';
        hasError = true;
      }

      if (Object.keys(attErrors).length > 0) {
        newErrors[att.id] = attErrors;
      }
    });

    setErrors(newErrors);
    return !hasError;
  }

  function handleNext() {
    if (validate()) {
      onSubmit(attendees);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>DATOS DE CADA ASISTENTE</Text>
        <Text style={styles.subtitle}>
          Completá nombre, apellido y DNI para cada entrada. Los productos sin
          ticket no requieren este paso.
        </Text>
      </View>

      {/* Lista de tarjetas por entrada */}
      <View style={styles.cardsList}>
        {attendees.map((att) => {
          const attErr = errors[att.id] || {};

          return (
            <View key={att.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardBadge}>Entrada {att.attendeeNumber}</Text>
                <Text style={styles.cardTicketName} numberOfLines={1}>
                  {att.ticketName}
                </Text>
              </View>

              <View style={styles.row}>
                <View style={styles.halfCol}>
                  <Text style={styles.label}>
                    Nombre <Text style={styles.req}>*</Text>
                  </Text>
                  <TextInput
                    style={[styles.input, attErr.firstName && styles.inputError]}
                    placeholder="Nombre"
                    placeholderTextColor="#999999"
                    value={att.firstName}
                    onChangeText={(val) =>
                      handleFieldChange(att.id, 'firstName', val)
                    }
                    autoCapitalize="words"
                    autoCorrect={false}
                    returnKeyType="next"
                  />
                  {attErr.firstName ? (
                    <Text style={styles.errorText}>{attErr.firstName}</Text>
                  ) : null}
                </View>

                <View style={styles.halfCol}>
                  <Text style={styles.label}>
                    Apellido <Text style={styles.req}>*</Text>
                  </Text>
                  <TextInput
                    style={[styles.input, attErr.lastName && styles.inputError]}
                    placeholder="Apellido"
                    placeholderTextColor="#999999"
                    value={att.lastName}
                    onChangeText={(val) =>
                      handleFieldChange(att.id, 'lastName', val)
                    }
                    autoCapitalize="words"
                    autoCorrect={false}
                    returnKeyType="next"
                  />
                  {attErr.lastName ? (
                    <Text style={styles.errorText}>{attErr.lastName}</Text>
                  ) : null}
                </View>
              </View>

              <View style={styles.fullCol}>
                <Text style={styles.label}>
                  DNI <Text style={styles.req}>*</Text>
                </Text>
                <TextInput
                  style={[styles.input, attErr.dni && styles.inputError]}
                  placeholder="12.345.678"
                  placeholderTextColor="#999999"
                  value={att.dni}
                  onChangeText={(val) => handleFieldChange(att.id, 'dni', val)}
                  keyboardType="numeric"
                  maxLength={10}
                  returnKeyType="next"
                />
                {attErr.dni ? (
                  <Text style={styles.errorText}>{attErr.dni}</Text>
                ) : null}
              </View>
            </View>
          );
        })}
      </View>

      {/* Botones de acción */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Siguiente paso: Confirmar compra"
        >
          <Text style={styles.nextButtonText}>SIGUIENTE</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Volver al paso de datos del comprador"
        >
          <Text style={styles.backButtonText}>ATRÁS</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 24,
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    lineHeight: 16,
  },
  cardsList: {
    gap: 12,
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingBottom: 8,
  },
  cardBadge: {
    backgroundColor: '#332F2B',
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  cardTicketName: {
    flex: 1,
    fontSize: 12.5,
    fontWeight: '700',
    color: '#1F2937',
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  halfCol: {
    flex: 1,
  },
  fullCol: {},
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 4,
  },
  req: {
    color: '#E63946',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 9,
    fontSize: 13,
    color: '#111827',
    backgroundColor: '#FAFAFA',
  },
  inputError: {
    borderColor: '#E63946',
    backgroundColor: '#FFF5F5',
  },
  errorText: {
    fontSize: 10,
    color: '#E63946',
    marginTop: 2,
    fontWeight: '600',
  },
  actionsContainer: {
    gap: 10,
  },
  nextButton: {
    backgroundColor: '#54C1C3',
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#54C1C3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  nextButtonText: {
    color: '#332F2B',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  backButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#BCBCBC',
    paddingVertical: 13,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    color: '#332F2B',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
});
